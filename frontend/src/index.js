import React, { Suspense } from "react"
import { render } from "react-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "./queryClient"
import "./translations/i18n"
import App from "Components/App"

render(
  <QueryClientProvider client={queryClient}>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </QueryClientProvider>,
  document.getElementById("app")
)
