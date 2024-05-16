import { revalidateTag } from "next/cache";
import Image from "next/image";

export interface Product {
  id?: string;
  product: string;
  price: number;
}

export default async function Home() {

  const res = await fetch('https://66435b4a6c6a65658706bdb2.mockapi.io/products', {
    cache: 'no-cache',
    next: {
      tags: ['products']
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const products: Product[] = await res.json();

  const addProductToDb = async (e: FormData) => {
    "use server"
    const product = e.get('product')?.toString();
    const price = e.get('price')?.toString();

    if (!product || !price) {
      return;
    }

    const newProduct = {
      product: product,
      price: price
    }

    await fetch('https://66435b4a6c6a65658706bdb2.mockapi.io/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });

    revalidateTag('products');

  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Products Warehouse</h1>

      <form 
        action={addProductToDb}
        className="flex flex-col gap-5 max-w-xl mx-auto p-5"
      >
        <input 
          name="product"
          className="border border-gray-300 p-2 rounded-md"
          placeholder="Enter product name"
        />
        <input 
          name="price" 
          className="border border-gray-300 p-2 rounded-md"
          placeholder="Enter price"
        />
        <button className=" bg-blue-500 border text-white p-2 w-full rounded-md">Submit</button>
      </form>

      <div className="flex flex-wrap gap-5">
        {products.map((product, idx) => (
          <div key={idx} className="p-5 shadow">
            <p>{product.product}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
