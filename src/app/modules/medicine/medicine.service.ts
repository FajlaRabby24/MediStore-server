import status from "http-status";
import AppError from "../../errorHandlers/AppError";
import type { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { TMedicine, TMedicineUpdate } from "./medicine.type";

const addMedicineInDB = async (userId: string, payload: TMedicine) => {
  // 1. Find seller record for the user
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Only sellers can add medicines");
  }

  // 2. Check if category exists
  const category = await prisma.medicineCategory.findUnique({
    where: { id: payload.category_id },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Medicine category not found");
  }

  // 3. Create medicine
  const { expiry_date, ...rest } = payload;
  const result = await prisma.medicines.create({
    data: {
      name: rest.name,
      description: rest.description,
      price: rest.price,
      stock: rest.stock,
      category_id: rest.category_id,
      image: rest.image ?? null,
      seller_id: seller.id,
      expiry_date: expiry_date ? new Date(expiry_date) : null,
    },
  });

  return result;
};

const getAllMedicinesFromDB = async (query: IQueryParams) => {
  // Map 'category' to 'category.slug' for cleaner URLs and filtering
  if (query.category) {
    query["category.slug"] = query.category;
    delete query.category;
  }

  const medicineQuery = new QueryBuilder(prisma.medicines, query, {
    searchableFields: ["name", "description", "category.name", "category.slug"],
    filterableFields: ["price", "category.slug"],
    defaultSortBy: "created_at",
  })
    .where({ isActive: true }) // Publicly only show active medicines
    .include({ seller: true, category: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await medicineQuery.execute();
  return result;
};

const getSingleMedicineFromDB = async (id: string) => {
  const result = await prisma.medicines.findUnique({
    where: { id, isActive: true },
    include: {
      seller: true,
      category: true,
      reviews: {
        include: { user: true },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Medicine not found");
  }

  return result;
};

const updateMedicineInDB = async (
  userId: string,
  medicineId: string,
  payload: TMedicineUpdate,
) => {
  // 1. Find seller record
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Find medicine and check ownership
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new AppError(status.NOT_FOUND, "Medicine not found");
  }

  if (medicine.seller_id !== seller.id) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to update this medicine",
    );
  }

  // 3. Update

  const result = await prisma.medicines.update({
    where: { id: medicineId },
    data: payload,
  });

  return result;
};

const removeMedicineFromDB = async (userId: string, medicineId: string) => {
  // 1. Find seller record
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Find medicine and check ownership
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new AppError(status.NOT_FOUND, "Medicine not found");
  }

  if (medicine.seller_id !== seller.id) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to delete this medicine",
    );
  }

  // 3. Delete
  const result = await prisma.medicines.delete({
    where: { id: medicineId },
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  return await prisma.medicineCategory.findMany();
};

const getMedicineReviewsFromDB = async (medicineId: string) => {
  const result = await prisma.reviews.findMany({
    where: { medicine_id: medicineId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
  return result;
};

export const MedicineServices = {
  addMedicineInDB,
  getAllMedicinesFromDB,
  getSingleMedicineFromDB,
  updateMedicineInDB,
  removeMedicineFromDB,
  getAllCategoriesFromDB,
  getMedicineReviewsFromDB,
};
