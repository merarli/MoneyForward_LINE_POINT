const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // ブラウザが動く様子を確認する
    slowMo: 8  // 動作確認しやすいようにpuppeteerの操作を遅延させる
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

  //家計ページに移動
  await page.goto('https://moneyforward.com/cf')

  // // 遷移完了を待機する。
  // await page.waitForNavigation()

  const tenyuryoku_button = await page.$('.mf-mb-medium button')
  await tenyuryoku_button.click()

  //日付を入力
  await page.$eval('input[id="updated-at"]', element => element.value = '2020/09/01');
  await page.waitFor(200)

  //価格を入力
  await page.type('input[name="user_asset_act[amount]"]', '500');

  //大区分
  await page.click('#js-large-category-selected')
  await page.waitFor(200)
  await page.click('a[id="10"]')

  //小区分
  await page.click('#js-middle-category-selected')
  await page.waitFor(200)
  await page.click('a[id="95"]')

  //内容
  await page.type('input[id="js-content-field"]', 'タバコテスト');


  // await browser.close()
})().catch(error => console.error(error))
