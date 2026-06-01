import { Model, Document, UpdateQuery } from 'mongoose';

export const createRecord = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>
): Promise<T> => {
  return model.create(data);
};

export const getRecords = async <T extends Document>(
  model: Model<T>,
  conditions: Record<string, unknown> = {}
): Promise<T[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return model.find(conditions as any);
};

export const getRecord = async <T extends Document>(
  model: Model<T>,
  id: string
): Promise<T | null> => {
  return model.findById(id);
};

export const updateRecord = async <T extends Document>(
  model: Model<T>,
  id: string,
  data: UpdateQuery<T>
): Promise<T | null> => {
  return model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteRecord = async <T extends Document>(
  model: Model<T>,
  id: string
): Promise<T | null> => {
  return model.findByIdAndDelete(id);
};
