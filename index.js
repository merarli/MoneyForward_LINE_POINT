const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // ブラウザが動く様子を確認する
    slowMo: 20  // 動作確認しやすいようにpuppeteerの操作を遅延させる
  })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 800,
  })

  // TOP page
  await page.goto('https://moneyforward.com/')

  //ログインページに移動
  const to_login_button = await page.$('.web-sign-in > a')
  console.log('to_login_button: ' + to_login_button)
  await to_login_button.click()

  // 遷移完了を待機する。
  await page.waitForNavigation()

  // const login_buttons = await page.$$('some selecter > .buttonWrapper > div > a')
  const go_google_login_page = await page.$('.buttonWrapper > div > a:nth-child(2)')
  await go_google_login_page.click()

  // 遷移完了を待機する。
  await page.waitForNavigation()

  const user_data = require('./user_config.json')

  //メールアドレス入力
  await page.type('#identifierId', user_data.mail)
  await page.keyboard.press('Enter');

  // 遷移完了を待機する。
  await page.waitForNavigation()

  //すぐにパスワードを入力すると、入力が正しく行われないのでスリープする
  await page.waitFor(1000)
  await page.type('input[type=password]',user_data.password)

  await page.keyboard.press('Enter')

  // 遷移完了を待機する。
  await page.waitForNavigation()

  // let itemSelector="some selecter > .buttonWrapper > div > a";
  // let listSelector="some selecter > .buttonWrapper > div > a";
  //
  // var item = await page.$(itemSelector);
  // var data = await (await item.getProperty('textContent')).jsonValue();


  // console.log('go_google_login_page: ' + await go_google_login_page.getProperty('textContent').jsonValue())
  // console.log(JSON.stringify(login_buttons))
  //
  // for (let i = 0; i < login_buttons.length; i++) {
  //   console.log(await login_buttons[i].getProperties('textContent').jsonValue())
  // }

  // for (const login_button in login_buttons) {
  //   console.log('login_button: ' + login_button)
  // }


  // メールアドレスとパスワードを入力する

  // await page.type('#password', 'secret')
  // ログインボタンを押す
  // const loginButton = await page.$('button[type=submit]')
  // await loginButton.click()

  // await browser.close()
})().catch(error => console.error(error))
