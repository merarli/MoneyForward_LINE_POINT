const puppeteer = require('puppeteer')

//登録データ読み込み
const income_json = require('/Users/merarli/Downloads/line_point (18).json')
// const spending_json = require('/Users/merarli/Downloads/2020-09-08-18-57-line-point-use.json')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // ブラウザが動く様子を確認する
    slowMo: 3  // 動作確認しやすいようにpuppeteerの操作を遅延させる
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
  await page.keyboard.press('Enter')

  // 遷移完了を待機する。
  await page.waitForNavigation()

  //すぐにパスワードを入力すると、入力が正しく行われないのでスリープする
  await page.waitFor(1000)
  await page.type('input[type=password]', user_data.password)

  await page.keyboard.press('Enter')

  // 遷移完了を待機する。
  await page.waitForNavigation()

  //date: 日付 yyyy/mm/dd
  //money_amount: 金額 string
  //spending_src_id: 支出元id string
  //big_divisions_id: 大区分 string
  //small_divisions_id: 小区分 number
  //small_divisions_id: 小区分 number
  //text: 内容(任意) string
  const setSpending = async ({ date, money_amount, spending_src_id, big_divisions_id, small_divisions_id, text }) => {
    console.log({ date, money_amount, spending_src_id, big_divisions_id, small_divisions_id, text })
    //家計ページに移動
    await page.goto('https://moneyforward.com/cf')

    const tenyuryoku_button = await page.$('.mf-mb-medium button')
    await tenyuryoku_button.click()

    //日付を空にする
    await page.$eval('input[id="updated-at"]', (element) => {
      element.value = ''
    })
    await page.waitFor(500)

    //日付を入力
    await page.type('input[id="updated-at"]', date)
    //日付入力は入力補助のプラグインが悪さするのかわからないが、入力完了までにerrorが起きるので余裕をもって２秒sleep
    await page.waitFor(1000)
    //外部をクリックして日付入力を確定させる
    await page.click('.modal-header')

    //価格を入力
    await page.type('input[name="user_asset_act[amount]"]', money_amount)

    //支出元をクリック
    await page.select('select[id="user_asset_act_sub_account_id_hash"]', spending_src_id)
    await page.waitFor(200)

    //大区分
    await page.click('a[id="js-large-category-selected"]')
    await page.waitFor(500)
    await page.click(`.dropdown-submenu > a[id="${big_divisions_id}"]`)

    //小区分
    await page.click('a[id="js-middle-category-selected"]')
    await page.waitFor(500)
    await page.click(`a[id="${small_divisions_id}"]`)

    //内容
    await page.type('input[id="js-content-field"]', text)

    //保存
    await page.click('input[id="submit-button"]')
    await page.waitFor(1000)
    //閉じる
    // await page.click('input[id="cancel-button"]')
  }

  //date: 日付 yyyy/mm/dd
  //money_amount: 金額 string
  //spending_src_id: 支出元id string
  //big_divisions_id: 大区分 string
  //small_divisions_id: 小区分 number
  //small_divisions_id: 小区分 number
  //text: 内容(任意) string
  const setIncome = async ({ date, money_amount, spending_src_id, big_divisions_id, small_divisions_id, text }) => {
//家計ページに移動
    await page.goto('https://moneyforward.com/cf')

    const tenyuryoku_button = await page.$('.mf-mb-medium button')
    await tenyuryoku_button.click()

    await page.waitFor(200)
    //収入を押す
    await page.click('li[id="info"]')
    await page.waitFor(500)

    //日付を空にする
    await page.$eval('input[id="updated-at"]', (element) => {
      element.value = ''
    })
    await page.waitFor(500)

    //日付を入力
    await page.type('input[id="updated-at"]', date)
    //日付入力は入力補助のプラグインが悪さするのかわからないが、入力完了までにerrorが起きるので余裕をもって２秒sleep
    await page.waitFor(1000)
    //外部をクリックして日付入力を確定させる
    await page.click('.modal-header')

    //価格を入力
    await page.type('input[name="user_asset_act[amount]"]', money_amount)

    //支出元をクリック
    await page.select('select[id="user_asset_act_sub_account_id_hash"]', spending_src_id)
    await page.waitFor(200)

    //大区分
    await page.click('#js-large-category-selected')
    await page.waitFor(500)
    await page.click(`a[id="${big_divisions_id}"]`)

    //小区分
    await page.click('#js-middle-category-selected')
    await page.waitFor(500)
    await page.click(`a[id="${small_divisions_id}"]`)

    //内容
    await page.type('input[id="js-content-field"]', text)

    //保存
    await page.click('input[id="submit-button"]')
    await page.waitFor(1000)
    //閉じる
    // await page.click('input[id="cancel-button"]')
  }

  // for (const item in spending_json) {
  //   console.log(spending_json[item])
  //
  //   //とりあえず2月まで登録
  //   if (spending_json[item].date.toString().includes('2020-01')) {
  //     break
  //   }
  //
  //   //4,3,2月だけ登録する
  //   if(
  //     !spending_json[item].date.toString().includes('2020-04') &&
  //     !spending_json[item].date.toString().includes('2020-03') &&
  //     !spending_json[item].date.toString().includes('2020-02')
  //   ){
  //     continue
  //   }
  //
  //   await setSpending({
  //     date: spending_json[item].date.slice(0, 10).replace(/-/g, '/'),
  //     money_amount: (Math.abs(Number(spending_json[item].point))).toString(),
  //     spending_src_id: 'Svu0k4ngMOHFoDZV3OtSQw',
  //     big_divisions_id: 0,//未分類
  //     small_divisions_id: 0,//未分類
  //     text: spending_json[item].title
  //   })
  // }

  for (const item in income_json){
    console.log(income_json[item])

    //マイナスなら支出
    if(Number(income_json[item].point) < 0){
      await setSpending({
        date: income_json[item].date.slice(0,10).replace(/-/g,'/'),
        money_amount: (Math.abs(Number(income_json[item].point))).toString(),
        spending_src_id: 'Svu0k4ngMOHFoDZV3OtSQw',
        big_divisions_id: 18,//その他
        small_divisions_id: 8811442,
        text: income_json[item].title
      })
    }else{
      await setIncome({
        date: income_json[item].date.slice(0,10).replace(/-/g,'/'),
        money_amount: income_json[item].point,
        spending_src_id: 'Svu0k4ngMOHFoDZV3OtSQw',
        big_divisions_id: 1,//収入
        small_divisions_id: 4486837,
        text: income_json[item].title
      })
    }
  }

  // await browser.close()
})().catch(error => console.error(error))
