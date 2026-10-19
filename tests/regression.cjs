/* Optional development-only regression suite. See README for setup. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const sample = fs.readFileSync(path.join(root, 'examples/sample-test.txt'), 'utf8');
const format = fs.readFileSync(path.join(root, 'examples/mock-test-format.txt'), 'utf8');
const checks = [];
function pass(name) { checks.push(name); console.log('PASS:', name); }
(async () => {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync(path.join(root, 'index.html')));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}), args:['--no-sandbox']});
    const context = await browser.newContext({viewport:{width:1280,height:1000}, permissions:['clipboard-read','clipboard-write'], acceptDownloads:true});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const summary = await page.evaluate(text => {
      const r = parseTest(text);
      return {ok:r.ok, types:r.test.Q.map(q=>q.type), marks:r.test.Q.reduce((a,q)=>a+(q.m ?? r.test.settings.mc),0), issues:r.issues};
    }, sample);
    assert.deepEqual(summary, {ok:true,types:['single','multiple'],marks:6,issues:[]});
    const parser = await page.evaluate(text => {
      const old = text.replace('[Type: multiple] ', '');
      const fixture = tag => `Q1. ${tag} A test question?\nA. One\nB. Two\nC. Three\nD. Four\nE. Five\nF. Six`;
      return {
        legacy:parseTest(old).test.Q.map(q=>q.type),
        upper:parseTest(fixture('[Type: MULTIPLE]')).test.Q[0].type,
        explicit:parseTest(fixture('[Type: single]')).test.Q[0].type,
        unknown:parseTest(fixture('[Type: multi]')).ok,
        duplicate:parseTest(fixture('[Type: single] [Type: multiple]')).ok,
        malformed:parseTest(fixture('[Type multiple]')).ok,
        empty:parseTest('').ok,
        six:parseTest(fixture('[Type: multiple]')).test.Q[0].o.length,
        builtins:Object.values(TESTS).map(t=>({n:t.Q.length,allSingle:t.Q.every(q=>!isMultiple(q))}))
      };
    }, sample);
    assert.deepEqual(parser,{legacy:['single','single'],upper:'multiple',explicit:'single',unknown:false,duplicate:false,malformed:false,empty:false,six:6,builtins:[{n:50,allSingle:true},{n:50,allSingle:true}]});
    assert.equal(await page.evaluate(()=>FORMAT_TXT),format);
    pass('mixed/legacy imports, strict Type validation, six options, built-in compatibility, synchronized format file');

    // Migrate a legacy in-progress numeric answer, plus invalid saved entries.
    await page.evaluate(()=>localStorage.setItem('mocktest_v2_1',JSON.stringify({cur:0,answers:{0:1,1:[],2:[2,2,99,-1,'1'],3:null,999:2},marked:{0:true},comments:{0:'old note'},elapsed:1234,started:true})));
    await page.reload();
    await page.getByRole('button',{name:'Resume',exact:true}).click();
    assert.deepEqual(await page.evaluate(()=>st.answers),{'0':[1],'2':[2]});
    assert.equal(await page.locator('#opts input[type=radio]:checked').count(),1);
    assert.equal(await page.locator('#comment').inputValue(),'old note');
    await page.locator('#opts input').nth(2).check();
    assert.deepEqual(await page.evaluate(()=>answerFor(0)),[2]);
    await page.locator('#opts input').nth(2).check();
    assert.deepEqual(await page.evaluate(()=>answerFor(0)),[2]);
    await page.keyboard.press('2');
    assert.deepEqual(await page.evaluate(()=>answerFor(0)),[1]);
    await page.locator('#btnClear').click();
    assert.deepEqual(await page.evaluate(()=>answerFor(0)),[]);
    pass('numeric-answer migration, invalid-value filtering, review-note retention, single-answer replacement and clear');
    await page.locator('#btnHome').click();
    await page.evaluate(()=>openImport());
    await page.locator('#impText').fill(sample.replace('[Type: multiple]','[Type: invalid]'));
    await page.waitForTimeout(600);
    assert.equal(await page.locator('#impAdd').isDisabled(),true);
    await page.locator('#impFile').setInputFiles({name:'sample-test.txt',mimeType:'text/plain',buffer:Buffer.from(sample)});
    await page.waitForFunction(()=>pending && pending.Q.length===2);
    assert.match(await page.locator('#impResult').innerText(),/1 multiple-answer/);
    await page.locator('#impResult summary').click();
    assert.match(await page.locator('#impResult').innerText(),/\[Type: multiple\]/);
    await page.locator('#impAdd').click();
    await page.locator('#setupStart').click();
    await page.locator('#opts input').nth(1).check();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#opts input[type=checkbox]').count(),4);
    assert.match(await page.locator('#selectionHelp').innerText(),/Select all correct/);
    // Label click and keyboard use the same toggle path.
    await page.locator('#opts .opt').nth(2).click();
    await page.keyboard.press('1');
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[0,2]);
    assert.equal(await page.evaluate(()=>answeredN()),2);
    await page.keyboard.press('1');
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[2]);
    await page.locator('#opts input').nth(2).focus();
    await page.keyboard.press('Space');
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[]);
    assert.equal(await page.evaluate(()=>answeredN()),1);
    assert.equal(await page.locator('#grid button.ans').count(),1);
    assert.equal(await page.locator('#btnClear').isDisabled(),true);
    await page.keyboard.press('3');
    await page.keyboard.press('1');
    await page.locator('#btnMark').click();
    await page.locator('#comment').fill('Why A and C?');
    // Digits in comment must not toggle an option.
    await page.keyboard.type(' 2');
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[0,2]);
    pass('file upload, blocked invalid imports, type-aware preview, checkbox click/keyboard/space toggling and unanswered counts');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#opts input[type=radio]:checked').count(),1);
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#opts input[type=checkbox]:checked').count(),2);
    const testId=await page.evaluate(()=>T);
    await page.reload();
    await page.locator('#myList').getByRole('button',{name:'Resume',exact:true}).click();
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[0,2]);
    assert.equal(await page.locator('#comment').inputValue(),'Why A and C? 2');
    assert.match(await page.locator('#myList').innerText(),/2\/2 answered/);
    await page.locator('#btnSubmitTop').click();
    await page.locator('#dlgYes').click();
    assert.equal(await page.locator('#sAns').innerText(),'2');
    assert.equal(await page.locator('#sSkip').innerText(),'0');
    const report=await page.evaluate(()=>buildTxt());
    for(const text of ['[Type: single]','[Type: multiple]','My answer: A, C','Q2: A, C','Q2 — my answer: A, C','Why A and C? 2','Award no partial credit','once per question','[Marks: 4]','Maximum total: 6']) assert.ok(report.includes(text),text);
    assert.ok(!report.includes('undefined'));
    const download=page.waitForEvent('download');
    await page.locator('#btnDownload').click();
    const file=await download;
    const downloaded=fs.readFileSync(await file.path(),'utf8');
    assert.ok(downloaded.includes('My answer: A, C'));
    await page.locator('#btnCopy').click();
    await page.waitForFunction(()=>document.getElementById('copyMsg').textContent.includes('Copied'));
    assert.match(await page.locator('#copyMsg').innerText(),/Copied/);
    assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).includes('My answer: A, C'));
    pass('navigation, reload/resume, question-level counts, review notes, type-aware exports, real download and clipboard');
    await page.locator('#btnBack').click();
    if(process.env.QA_DIR){
      fs.mkdirSync(process.env.QA_DIR,{recursive:true});
      await page.screenshot({path:path.join(process.env.QA_DIR,'multiple-desktop.png'),fullPage:true});
    }
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,'multiple-mobile.png'),fullPage:true});
    await page.emulateMedia({colorScheme:'dark'});
    if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,'multiple-mobile-dark.png'),fullPage:true});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('#btnClear').click();
    await page.locator('#btnSubmitTop').click();
    assert.match(await page.locator('#dlgMsg').innerText(),/1 unanswered/);
    await page.locator('#dlgNo').click();
    assert.ok((await page.evaluate(()=>buildTxt())).includes('My answer: NOT ANSWERED'));
    await page.evaluate(()=>{selectAnswer(1,2);selectAnswer(1,0);st.elapsed=S().time*60000;tick();});
    assert.equal(await page.locator('#done').isVisible(),true);
    assert.equal(await page.locator('#btnBack').isDisabled(),true);
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[0,2]);
    await page.reload();
    await page.locator('#myList').getByRole('button',{name:'View / download'}).click();
    assert.deepEqual(await page.evaluate(()=>answerFor(1)),[0,2]);
    assert.equal(await page.evaluate(()=>T),testId);
    // All six options, duplicates and invalid saved values normalize consistently.
    assert.deepEqual(await page.evaluate(()=>selectedOptions({type:'multiple',o:['a','b','c','d','e','f']},[5,0,5,2,-1,6,'3',null])),[0,2,5]);
    assert.equal(await page.evaluate(()=>answerText(1)),'A, C');
    await page.evaluate(()=>{
      const r=parseTest('TEST_TITLE: Six options\nQ1. [Type: multiple] Select options.\nA. One\nB. Two\nC. Three\nD. Four\nE. Five\nF. Six');
      LIB.push({...r.test,id:'six-option-regression'});
      beginTest('six-option-regression','new');
    });
    await page.keyboard.press('6');
    await page.keyboard.press('5');
    assert.deepEqual(await page.evaluate(()=>answerFor(0)),[4,5]);
    assert.equal(await page.locator('#opts input:checked').count(),2);
    await page.keyboard.press('6');
    assert.deepEqual(await page.evaluate(()=>answerFor(0)),[4]);
    assert.deepEqual(errors,[]);
    pass('mobile/light/dark overflow, unanswered export, auto-submit/reload, canonical option ordering, no browser errors');
    console.log(`\n${checks.length} regression groups passed.`);
  } finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
