---
title: stripe 最佳实践
author: yrobot
keywords: stripe,pay,支付,最佳实践
createTime: 2023年11月7日
---

## stripe 简介

Stripe 是一家协助个人或公司在互联网上接受付款服务的支付服务提供商。

Stripe 可以让公司通过网络以多种货币方式接受付款。

Stripe 的主要产品和服务包括:

- 支付处理 - 将信用卡或数字钱包与 Stripe 账户连接以处理在线付款。提供支持多种支付方式的 API。
- 订阅计费 - 管理定期计费和订阅支付。
- 防欺诈服务 - 使用机器学习防止诈骗和欺诈交易。
- Sigma - Stripe 的商业智能工具,用于分析支付数据和见解。
- Issuing - 简化发卡流程,让企业可以自己发行虚拟和实体卡。
- Terminal - 允许使用 iPad 等移动设备来进行面对面支付。

总体来说,Stripe 致力于为全球范围内的在线商务提供安全可靠的支付处理服务。

## Stripe 的 在线支付

https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=checkout

### Stripe 在线支付流程梳理

Stripe 的基本在线支付流程主要可以分为以下步骤:

1. 商家在 Stripe 创建账号,并获得 API keys。这时需要提供商家信息进行验证。
1. 商家使用 Stripe 提供的 API 在自己的网站或 App 上集成支付功能。可以使用 Stripe 提供的库来加快集成进度。
1. 当客户在商家网站购物时,在支付的时候会调用 Stripe 的 API 创建一个 payment intent。这包含支付的金额、货币、支付方式等信息。
1. Stripe 会根据 payment intent 信息,使用客户提供的支付方式(比如信用卡),创建一个 payment method。这包含支付授权所需的信息。
1. Stripe 使用 payment method 向支付网络(比如 Visa 网关)请求授权。授权成功后,会冻结客户账户相应金额。
1. Stripe 收到支付网络的确认信息,完成客户的支付,并通过 webhook 等方式通知商家支付成功。
1. 商家在收到 Stripe 的支付确认后,完成订单处理和发货。
1. 最后 Stripe 会按照与商家的结算协议,在一定时间后把交易款项汇给商家。

### Stripe 在线支付 方案

#### Stripe Elements

使用 Stripe 实现好的 组件库（js、RN、IOS、Android）在自建网站上构建 支付表单。

为了数据安全，每个 Element 都用 iframe 包裹实现，但这样提升了样式定制和数据获取的难度

![V0qrlT-11-53-40](https://images.yrobot.top/2023-11-09/V0qrlT-11-53-40.png)

定制化 Element 样式（可配置有限）：https://stripe.com/docs/elements/appearance-api

流程图：

![Hj8qdR-18-51-06](https://images.yrobot.top/2023-11-08/Hj8qdR-18-51-06.png)

https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements

流程:

1. 支付时，先由后端调用 Stripe API 创建 PaymentIntent，并把 clientSecret 传给前端。
1. 前端根据 clientSecret 和 Stripe Elements 生成支付表单
1. 用户在表单输入信息,Elements JS 会加密处理用户输入。
1. 用户提交表单，数据会直接发送给 Stripe 服务器
1. 前后端通过 Stripe SDK/Webhook 获取 PaymentIntent 状态 。
1. 根据状态显示支付结果页面。

优点:

- 安全性更高 - Elements 会自动处理支付数据的传输加密,有助于 PCI DSS 合规。
- 样式可定制 - 可以根据品牌需求自定义 Elements 的样式,提供更一致的用户体验。
- 用户体验更好 - Elements 内建了输入校验,可以帮助用户减少输入错误。
- 集成更便捷 - Elements 封装了请求与处理支付数据的代码,简化了客户端集成。
- 兼容性好 - Elements 支持主流的 UI 框架,可以跨浏览器、设备兼容。

劣势:

- 定制困难 - 相比完全自建表单,Elements 的定制仍有限制。
- 依赖 Stripe 服务 - 必须依赖 Stripe 的 API 与后台服务,无法自建类似服务。
- 不支持某些定制支付方式 - 一些非标准定制支付方式可能无法通过 Elements 实现。
- 新增字段不够灵活 - 如果需要添加非标准字段,Elements 不一定能很好支持。

##### 示例代码：

- https://stripe.com/docs/payments/quickstart?lang=node

[SERVER] create payment intent

```js
app.post("/create-payment-intent", async (req, res) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 999,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
```

[CLIENT] init form & submit payment

```js
const { clientSecret } = await fetch("/create-payment-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ items }),
}).then((res) => res.json());

elements = stripe.elements({ appearance, clientSecret });
const paymentElement = elements.create("payment", {});
paymentElement.mount("#payment-element");

const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: "http://localhost:4242/checkout.html",
    receipt_email: "email@email.com",
  },
});
```

[CLIENT] check payment status

```js
// rely on the return_url in stripe.confirmPayment
const clientSecret = new URLSearchParams(window.location.search).get(
  "payment_intent_client_secret" // return by stripe
);

if (!clientSecret) {
  return;
}

const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

switch (paymentIntent.status) {
  case "succeeded":
    showMessage("Payment succeeded!");
    break;
  case "processing":
    showMessage("Your payment is processing.");
    break;
  case "requires_payment_method":
    showMessage("Your payment was not successful, please try again.");
    break;
  default:
    showMessage("Something went wrong.");
    break;
}
```

#### Stripe Checkout

商户可以通过 Stripe Checkout 预构建 支付表单。然后可以 1. 将这个 Checkout 嵌入到 自建网站 让客户在自建网站上完成支付，2. 将用户引导到 Stripe 的托管页面进行支付

流程图:

![KvOtMI-16-21-45](https://images.yrobot.top/2023-11-08/KvOtMI-16-21-45.png)

https://stripe.com/docs/payments/checkout/how-checkout-works?payment-ui=embeddable-payment-form

流程:

1. 商户初始化 Checkout,配置产品信息,金额等参数。
1. 用户点击支付按钮,打开 Stripe Checkout 支付页面。
1. 用户在页面输入支付信息
1. 用户提交表单，数据会直接发送给 Stripe 服务器
1. 前后端通过 Stripe SDK/Webhook 获取 PaymentIntent 状态 并展示结果页

优点:

- 集成简单快速 - 一些简单 API 调用就可以快速集成,无需构建自定义支付页面。
- 用户体验优秀 - Checkout 内置了最佳实践的支付流程设计。

劣势:

- 定制性有限 - Checkout 的页面风格和流程无法自主定制。
- 依赖 Stripe 服务 - 必须接入 Stripe 的支付后台服务,无法自建类似服务。
- 无法深度集成 - Checkout 无法像 Elements 那样深度嵌入支付流程。

##### 示例代码：

- https://stripe.com/docs/checkout/embedded/quickstart?lang=node&client=react

[SERVER] APIS: 1. create checkout session 2. retrieve checkout session status

```js
app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });
  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});
```

[CLIENT] App 路由分发: 1. /checkout 付款页面 2. /return 结果页面

```jsx
const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </Router>
    </div>
  );
};
```

[CLIENT] /checkout 付款页面: 1. 获取 checkout session 2. 根据 checkout session 初始化 Checkout 付款组件

```jsx
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_qblFNYngBkEdjEZ16jxxoWSM");

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ clientSecret }) => setClientSecret(clientSecret));
  }, []);
  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
};
```

[CLIENT] /return 结果页面: 1. 根据 server 逻辑配置的 return_url 获取 session_id 2. 利用 session_id 获取 checkout session 状态

```jsx
const Return = () => {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      });
  }, []);
  switch (status) {
    case "open":
      return <Navigate to="/checkout" />;
    case "complete":
      return <section id="success"> We appreciate your business!</section>;
    default:
      return null;
  }
};
```

#### Payment Links

流程：

1. 商户通过 Stripe Dashboard 或者 API 生成 Payment Link。
1. Payment Link 包含支付所需的所有参数信息,以链接的形式发送给客户。
1. 客户打开链接,会进入一个 Stripe 托管的支付页面。
1. 客户在该页面输入支付信息,例如信用卡号,完成支付。
1. Stripe 验证支付信息,完成支付流程,并通知商户支付结果。

优点:

- 简单快速,无需接入和开发,生成链接就能收款。
- 链接可以通过各种途径分享,如邮件、消息等。
- 支持一次性和订阅支付。
- 支付页面由 Stripe 托管,合规性好。

劣点:

- 无法深度定制支付页面。
- 无法在自有应用内嵌入支付流程。
- 分析和客服能力有限。
- 只支持卡支付,不支持第三方数字钱包。

Payment Links 非常适合轻交易场景,对支付流程要求不复杂,且有现成渠道接触客户的情况,可以快速开启收款业务。但不适合需要深度定制或内嵌支付的场景

## 常见问题

### Stripe Elements 和 Stripe Checkout 有什么区别？

核心区别：抽象的颗粒度不同，Elements 只是抽象了支付表单，Checkout 抽象了整个支付页面。

所以导致了，Elements 可以更灵活的定制支付表单，但是需要自己构建支付页面，而 Checkout 可以快速集成，但是定制性不足。

从上面 Stripe Checkout 的 代码 章节也能看到，使用了 Stripe Checkout，支付页面单纯暴露 Checkout 即可完成支付页。

### 希望直接在页面内完成付款后直接展示结果，而不是通过 url 重定向，因为重定向会刷新页面导致页面数据状态丢失

参考资料：

- stripe.confirmPayment 文档 https://stripe.com/docs/js/payment_intents/confirm_payment

解决方案：不重定向 + 异步获取 payment 状态

- 不重定向
  stripe.confirmPayment 支持修改 redirect，如果你设置 `redirect: "if_required"`，则只有当您的用户选择基于重定向的付款方式时，stripe.confirmPayment 才会重定向。
- 异步获取 payment 状态
  stripe.confirmPayment 是 Promise<PaymentIntentResult>，可以由此 获取 payment 状态，或错误信息
  ```ts
  type PaymentIntentResult =
    | { paymentIntent: api.PaymentIntent; error?: undefined }
    | { paymentIntent?: undefined; error: StripeError };
  ```

![0qvIXY-16-38-38](https://images.yrobot.top/2023-11-09/0qvIXY-16-38-38.png)

NOTE：

1. 目前不确定哪些付款方式即使在`redirect: "if_required"` 也会重定向，也不确定哪些银行在 card 付款方式时会重定向，已知本地测试的 3 个卡号都不会重定向。

## Demo

### 利用 Stripe Elements 实现当前页面的支付、结果展示

在线体验：https://shop.demo.yrobot.top

代码仓库：https://github.com/yrobot-demo/stripe-demo
