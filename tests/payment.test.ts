import {test, expect } from "bun:test"
import dotenv from 'dotenv'
dotenv.config()

async function confirmTransaction(
  amount: string,
  invoiceNo: string,
  returnUrl: string,
  customerIp: string,
) {
  const url = "https://api.plutus.ly/api/v1/transaction/localbankcards/confirm";

  const formData = new FormData();
  formData.append("amount", amount);
  formData.append("invoice_no", invoiceNo);
  formData.append("return_url", returnUrl);
  formData.append("customer_ip", customerIp);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": `${process.env.PLUTU_API_KEY ?? ""}`,
      "Authorization": `Bearer ${process.env.PLUTU_ACCESS_TOKEN ?? ""}`,
    },
    body: formData,
  });

  return response.json();
}

test("confirmTransaction should return a valid response", async () => {
  const response = await confirmTransaction(
    "100",
    "INV12345",
    "https://yourreturn.url",
    "192.168.1.1",
  );
  expect(response.status).toBe(200);
  expect(response.result.code).toBe("CHECKOUT_REDIRECT");
});
