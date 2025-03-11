import React, { Suspense } from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import store from "./store"
import "./translations/i18n"
import App from "Components/App"

render(
  <Provider store={store}>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("app")
)
