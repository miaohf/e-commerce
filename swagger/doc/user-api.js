/********************************************************************
* Accounts - 取得 Profile
* GET http://localhost:3000/accounts
********************************************************************/

/**
 * @swagger
 * /accounts:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Account - 取得 User Profile
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 取得 User Profile 成功
 */

/********************************************************************
* Accounts - 修改 Profile
* PUT http://localhost:3000/accounts
********************************************************************/

/**
 * @swagger
 * /accounts:
 *   put:
 *     tags:
 *      - Accounts
 *     description: Account - 修改 User Profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: User name
 *         in: formData
 *         type: string
 *       - name: phone
 *         description: User 的 phone
 *         in: formData
 *         type: string
 *       - name: address
 *         description: User 的 address
 *         in: formData
 *         type: string
 *       - name: birthday
 *         description: User 的 birthday ( YYYY-MM-DD )
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: 修改 User Profile 成功
 */

/********************************************************************
* Accounts - 取得使用者擁有的 Coupons
* GET http://localhost:3000/accounts/coupons
********************************************************************/

/**
 * @swagger
 * /accounts/coupons:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Account - 取得使用者擁有的 Coupons
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 取得使用者擁有的 Coupons 成功
 */

/********************************************************************
* Accounts - 取得 Orders
* GET http://localhost:3000/accounts/orders
********************************************************************/

/**
 * @swagger
 * /accounts/orders:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Account - 取得使用者的訂單清單
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 取得使用者的訂單清單成功
 */

/********************************************************************
* Accounts - 取得 Order
* GET http://localhost:3000/accounts/orders/:order_id
********************************************************************/

/**
 * @swagger
 * /accounts/orders/{order_id}:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Account - 取得使用者單筆訂單資料
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: order_id
 *         type: integer
 *         required: true
 *         description: order_id
 *     responses:
 *       200:
 *         description: 取得使用者單筆訂單資料成功
 */

/********************************************************************
* Accounts - 取消 Order
* PUT http://localhost:3000/accounts/orders/:order_id/cancel
********************************************************************/

/**
 * @swagger
 * /accounts/orders/{order_id}/cancel:
 *   put:
 *     tags:
 *      - Accounts
 *     description: Account - 取消使用者單筆訂單資料
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: order_id
 *         type: integer
 *         required: true
 *         description: order_id
 *     responses:
 *       200:
 *         description: 取消使用者單筆訂單資料
 */

/********************************************************************
* Accounts - 使用者登入
* POST http://localhost:3000/accounts/signin
********************************************************************/

/**
 * @swagger
 * /accounts/signin:
 *   post:
 *     tags:
 *      - Accounts
 *     description: Accounts - 使用者登入
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 使用者的 email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: 登入的密碼
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 登入成功
 */

/********************************************************************
* Accounts - 使用者註冊
* POST http://localhost:3000/accounts/signup
********************************************************************/

/**
 * @swagger
 * /accounts/signup:
 *   post:
 *     tags:
 *      - Accounts
 *     description: Accounts - 使用者註冊
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: 使用者的 name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: 使用者的 email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: 使用者的 password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: passwordCheck
 *         description: 再次確認 password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         description: 使用者的 phone
 *         in: formData
 *         required: true
 *         type: string
 *       - name: address
 *         description: 使用者的 address
 *         in: formData
 *         required: true
 *         type: string
 *       - name: birthday
 *         description: 使用者的 birthday ( YYYY-MM-DD )
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 註冊成功
 */

/********************************************************************
* Accounts - 設定連結時效與寄發 mail
* POST http://localhost:3000/accounts/reset-password
********************************************************************/

/**
 * @swagger
 * /accounts/reset-password:
 *   post:
 *     tags:
 *      - Accounts
 *     description: Accounts - 設定連結時效與寄發 mail
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 使用者的 email
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 設定成功
 */

/********************************************************************
* Accounts - 驗證所收到的 email 連結是否還在有效期限內
* GET http://localhost:3000/accounts/reset-password/{token}
********************************************************************/

/**
 * @swagger
 * /accounts/reset-password/{token}:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Accounts - 驗證所收到的 email 連結是否還在有效期限內
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: token
 *         type: string
 *         required: true
 *         description: redis token ( from email )
 *     responses:
 *       200:
 *         description: 驗證成功
 */

/********************************************************************
* Accounts - 設定密碼
* PUT http://localhost:3000/accounts/modify-password
********************************************************************/

/**
 * @swagger
 * /accounts/modify-password:
 *   put:
 *     tags:
 *      - Accounts
 *     description: Accounts - 設定密碼
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: password
 *         description: 使用者新的 password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: passwordCheck
 *         description: 再次輸入 password 以確認跟第一次輸入的相同
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 修改密碼成功
 */

/********************************************************************
* Products - 取得所有 Product
* GET http://localhost:3000/products
********************************************************************/

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *      - Products
 *     description: Account - 取得所有 Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Put in category id that user want to query
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Put in keyword that user want to query
 *     responses:
 *       200:
 *         description: 取得所有 Product 成功
 */

/********************************************************************
* Products - 取得特定 Product
* GET http://localhost:3000/products/:product_id
********************************************************************/

/**
 * @swagger
 * /products/{product_id}:
 *   get:
 *     tags:
 *      - Products
 *     description: Account - 取得特定 Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: product_id
 *         type: integer
 *         required: true
 *         description: product_id
 *     responses:
 *       200:
 *         description: 取得特定 Product 成功
 */

/********************************************************************
* Products - Like 特定 Product
* POST http://localhost:3000/products/:product_id/like
********************************************************************/

/**
 * @swagger
 * /products/{product_id}/like:
 *   post:
 *     tags:
 *      - Products
 *     description: Account - Like 特定 Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: product_id
 *         type: integer
 *         required: true
 *         description: product_id
 *     responses:
 *       200:
 *         description: Like 特定 Product 成功
 */

/********************************************************************
* Products - Unlike 特定 Product
* POST http://localhost:3000/products/:product_id/unlike
********************************************************************/

/**
 * @swagger
 * /products/{product_id}/unlike:
 *   post:
 *     tags:
 *      - Products
 *     description: Product - Unlike 特定 Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: product_id
 *         type: integer
 *         required: true
 *         description: product_id
 *     responses:
 *       200:
 *         description: Unlike 特定 Product 成功
 */


/********************************************************************
* Accounts - 取得當前使用者資料
* GET http://localhost:3000/accounts/currentUser
********************************************************************/

/**
 * @swagger
 * /accounts/currentUser:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Accounts - 取得當前使用者資料
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 取得當前使用者資料成功
 */