import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, booksTable, categoriesTable } from "@workspace/db";
import {
  CreateBookBody,
  GetBookParams,
  GetBookResponse,
  ListBooksQueryParams,
  ListBooksResponse,
  UpdateBookBody,
  UpdateBookParams,
  UpdateBookResponse,
  DeleteBookParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/books", async (req, res): Promise<void> => {
  const query = ListBooksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.categoryId) {
    conditions.push(eq(booksTable.categoryId, query.data.categoryId));
  }
  if (query.data.search) {
    const searchTerm = `%${query.data.search}%`;
    conditions.push(ilike(booksTable.title, searchTerm));
  }

  const books = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      author: booksTable.author,
      description: booksTable.description,
      price: booksTable.price,
      originalPrice: booksTable.originalPrice,
      condition: booksTable.condition,
      imageUrl: booksTable.imageUrl,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      inStock: booksTable.inStock,
      createdAt: booksTable.createdAt,
    })
    .from(booksTable)
    .leftJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(booksTable.createdAt);

  const parsed = books.map((b) => ({
    ...b,
    price: Number(b.price),
    originalPrice: b.originalPrice != null ? Number(b.originalPrice) : null,
  }));

  res.json(ListBooksResponse.parse(parsed));
});

router.post("/books", async (req, res): Promise<void> => {
  const parsed = CreateBookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { adminPassword, ...bookData } = parsed.data;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [book] = await db
    .insert(booksTable)
    .values({
      ...bookData,
      price: String(bookData.price),
      originalPrice: bookData.originalPrice != null ? String(bookData.originalPrice) : undefined,
      inStock: bookData.inStock ?? true,
    })
    .returning();

  const withCategory = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      author: booksTable.author,
      description: booksTable.description,
      price: booksTable.price,
      originalPrice: booksTable.originalPrice,
      condition: booksTable.condition,
      imageUrl: booksTable.imageUrl,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      inStock: booksTable.inStock,
      createdAt: booksTable.createdAt,
    })
    .from(booksTable)
    .leftJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id))
    .where(eq(booksTable.id, book.id));

  const b = withCategory[0];
  res.status(201).json(
    GetBookResponse.parse({
      ...b,
      price: Number(b.price),
      originalPrice: b.originalPrice != null ? Number(b.originalPrice) : null,
    })
  );
});

router.get("/books/:id", async (req, res): Promise<void> => {
  const params = GetBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [book] = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      author: booksTable.author,
      description: booksTable.description,
      price: booksTable.price,
      originalPrice: booksTable.originalPrice,
      condition: booksTable.condition,
      imageUrl: booksTable.imageUrl,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      inStock: booksTable.inStock,
      createdAt: booksTable.createdAt,
    })
    .from(booksTable)
    .leftJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id))
    .where(eq(booksTable.id, params.data.id));

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json(
    GetBookResponse.parse({
      ...book,
      price: Number(book.price),
      originalPrice: book.originalPrice != null ? Number(book.originalPrice) : null,
    })
  );
});

router.patch("/books/:id", async (req, res): Promise<void> => {
  const params = UpdateBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { adminPassword, ...updateData } = parsed.data;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const setData: Record<string, unknown> = { ...updateData };
  if (updateData.price != null) setData.price = String(updateData.price);
  if (updateData.originalPrice != null) setData.originalPrice = String(updateData.originalPrice);

  const [updated] = await db
    .update(booksTable)
    .set(setData)
    .where(eq(booksTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  const withCategory = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      author: booksTable.author,
      description: booksTable.description,
      price: booksTable.price,
      originalPrice: booksTable.originalPrice,
      condition: booksTable.condition,
      imageUrl: booksTable.imageUrl,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      inStock: booksTable.inStock,
      createdAt: booksTable.createdAt,
    })
    .from(booksTable)
    .leftJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id))
    .where(eq(booksTable.id, params.data.id));

  const b = withCategory[0];
  res.json(
    UpdateBookResponse.parse({
      ...b,
      price: Number(b.price),
      originalPrice: b.originalPrice != null ? Number(b.originalPrice) : null,
    })
  );
});

router.delete("/books/:id", async (req, res): Promise<void> => {
  const params = DeleteBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const adminPassword = req.headers["x-admin-password"] as string;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [deleted] = await db
    .delete(booksTable)
    .where(eq(booksTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
