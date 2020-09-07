const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // ブラウザが動く様子を確認する
    slowMo: 300  // 動作確認しやすいようにpuppeteerの操作を遅延させる
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

  const login_buttons = await page.$$('.buttonWrapper a')
  for (const login_button in login_buttons) {
    console.log('login_button: ' + login_button)
  }


  // メールアドレスとパスワードを入力する
  // await page.type('#email', 'slncu@example.com')
  // await page.type('#password', 'secret')
  // ログインボタンを押す
  // const loginButton = await page.$('button[type=submit]')
  // await loginButton.click()

  // await browser.close()
})().catch(error => console.error(error))
