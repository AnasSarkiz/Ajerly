import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";
async function confirmTransaction(amount: string, invoiceNo: string, returnUrl: string, customerIp: string) {
    const url = 'https://api.plutus.ly/api/v1/transaction/localbankcards/confirm';
    
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('invoice_no', invoiceNo);
    formData.append('return_url', returnUrl);
    formData.append('customer_ip', customerIp);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'X-API-KEY': `${Deno.env.get("PLUTU_API_KEY") ?? ""}`,
            'Authorization': `Bearer ${Deno.env.get("PLUTU_ACCESS_TOKEN") ?? ""}`,
        },
        body: formData
    });
    
    return response.json();
}

Deno.test("confirmTransaction should return a valid response", async () => {
    const response = await confirmTransaction('100', 'INV12345', 'https://yourreturn.url', '192.168.1.1');
    assertEquals(response.status, 200);
    assertEquals(response.result.code, "CHECKOUT_REDIRECT");
    

});
