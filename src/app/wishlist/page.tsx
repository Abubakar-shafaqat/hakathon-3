// app/wishlist/page.tsx
"use client";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useWishlist } from "../context/page";
import Image from "next/image"; // Import the Image component

interface Product {
  id: number;
  img: string;
  title: string;
  title2: string;
  price: string;
  description: string;
  color: string[];
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const response = await fetch('https://677ff2a50476123f76a8dd73.mockapi.io/product');
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const allProducts = await response.json();

        // Filter products that are in wishlist
        const filteredProducts = allProducts.filter((product: Product) =>
          wishlist.includes(product.id)
        );

        setWishlistProducts(filteredProducts);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch wishlist products");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {wishlistProducts.length === 0 ? (
          <p className="text-center col-span-full">Your wishlist is empty!</p>
        ) : (
          wishlistProducts.map((item) => (
            <div key={item.id} className="hover:scale-105 transform transition duration-300 relative group">
              {/* Heart Icon (Top-Right Corner) */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full"
              >
                <FaHeart size={20} className="text-red-500" />
              </button>

              <Link
                href={`/products/product?id=${item.id}`}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#F5F5F5] aspect-square group p-0">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={288} // Adjust width as needed
                    height={288} // Adjust height as needed
                    className="w-72 h-72 object-cover rounded-t-lg"
                  />
                </div>
                <div className="mx-2 mt-2">
                  <h4 className="font-semibold text-[#9E3500] text-sm">{item.title2}</h4>
                  <h1 className="font-semibold text-sm mt-2">{item.title}</h1>
                  <h4 className="text-sm text-[#757575] justify-between">color: {item.color.join(', ')}</h4>
                  <h2 className="font-medium text-sm mt-2">MRP: {item.price}</h2>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
