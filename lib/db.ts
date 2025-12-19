
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join((process as any).cwd(), 'data');

// Class for managing Lists (Arrays of objects)
export class JsonDB<T> {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(DATA_DIR, filename);
  }

  private ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(this.filePath, '[]');
    }
  }

  public getAll(): T[] {
    this.ensureFile();
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}`, error);
      return [];
    }
  }

  public saveAll(items: T[]): void {
    this.ensureFile();
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
  }

  public add(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  public update(predicate: (item: T) => boolean, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex(predicate);
    
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    return items[index];
  }

  public delete(predicate: (item: T) => boolean): boolean {
    const items = this.getAll();
    const initialLength = items.length;
    const filtered = items.filter((item) => !predicate(item));
    
    if (filtered.length === initialLength) return false;
    
    this.saveAll(filtered);
    return true;
  }

  public find(predicate: (item: T) => boolean): T | undefined {
    return this.getAll().find(predicate);
  }
}

// Class for managing Single Objects (Configuration files)
export class JsonOne<T> {
  private filePath: string;
  private defaultData: T;

  constructor(filename: string, defaultData: T) {
    this.filePath = path.join(DATA_DIR, filename);
    this.defaultData = defaultData;
  }

  private ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.defaultData, null, 2));
    }
  }

  public get(): T {
    this.ensureFile();
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return this.defaultData;
    }
  }

  public save(data: T): void {
    this.ensureFile();
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}

// Singleton instances
import { Brand, Category, Product, Slide, Message, AnalyticsConfig } from '@/types';

export const brandsDB = new JsonDB<Brand>('brands.json');
export const categoriesDB = new JsonDB<Category>('categories.json');
export const productsDB = new JsonDB<Product>('productos_fakunet.json');
export const sliderDB = new JsonDB<Slide>('slider.json');
export const messagesDB = new JsonDB<Message>('messages.json');

export const analyticsConfigDB = new JsonOne<AnalyticsConfig>('analytics_config.json', {
  propertyId: '',
  clientEmail: '',
  privateKey: ''
});
