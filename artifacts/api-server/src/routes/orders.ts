import { Router, type IRouter } from "express";
import { CreateOrderBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

async function saveOrderToNotion(orderData: {
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ bookId: number; title: string; author: string; price: number; quantity: number }>;
  totalAmount: number;
  notes?: string;
}): Promise<string> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDbId = process.env.NOTION_ORDERS_DB_ID;

  if (!notionApiKey || !notionDbId) {
    throw new Error("Notion credentials not configured");
  }

  const itemsSummary = orderData.items
    .map((item) => `${item.title} by ${item.author} (x${item.quantity}) - ₹${item.price}`)
    .join("\n");

  const orderId = `ORD-${Date.now()}`;

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: notionDbId },
      properties: {
        "Order ID": {
          title: [{ text: { content: orderId } }],
        },
        "Customer Name": {
          rich_text: [{ text: { content: orderData.customerName } }],
        },
        Email: {
          email: orderData.email,
        },
        Phone: {
          phone_number: orderData.phone,
        },
        "Delivery Address": {
          rich_text: [
            {
              text: {
                content: [
                  orderData.addressLine1,
                  orderData.addressLine2,
                  orderData.city,
                  orderData.state,
                  orderData.pincode,
                ]
                  .filter(Boolean)
                  .join(", "),
              },
            },
          ],
        },
        "Total Amount": {
          number: orderData.totalAmount,
        },
        "Books Ordered": {
          rich_text: [{ text: { content: itemsSummary } }],
        },
        Notes: {
          rich_text: [{ text: { content: orderData.notes ?? "" } }],
        },
        Status: {
          select: { name: "New" },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, body: errorText }, "Notion API error");
    throw new Error(`Notion API error: ${response.status}`);
  }

  return orderId;
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const orderId = await saveOrderToNotion(parsed.data);

  res.status(201).json({
    success: true,
    message: "Order placed successfully! We will contact you shortly.",
    orderId,
  });
});

export default router;
