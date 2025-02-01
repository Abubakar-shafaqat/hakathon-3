"use client";


import { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import Image from "next/image"; // Import the Image component
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdPeopleOutline } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

type Car = {
  id: number;
  name: string;
  type: string;
  fuel_capacity: string;
  transmission: string;
  seating_capacity: string;
  price_per_day: string;
  image_url: string;
  tags: string[];
};

export default function WishlistPage() {
  const { wishlist, removeFromWishlist,addToWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const response = await fetch('https://678cc7fcf067bf9e24e83478.mockapi.io/carrental');
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const allProducts = await response.json();

        // Filter products that are in wishlist
        const filteredProducts = allProducts.filter((product: Car) =>
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
          wishlistProducts.map((car) => (
            <Card key={car.id} className="w-full max-w-[304px] mx-auto h-auto flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="w-full flex items-center justify-between">
                  {car.name}
                  <button
                                                            onClick={() =>
                                                              wishlist.includes(car.id)
                                                                ? removeFromWishlist(car.id)
                                                                : addToWishlist(car.id)
                                                            }
                                                            className="relative z-10 p-1 rounded-full bg-white"
                                                          >
                                                            {wishlist.includes(car.id) ? (
                                                              <FaHeart size={20} className="text-red-500" />
                                                            ) : (
                                                              <FaRegHeart size={20} className="text-gray-500" />
                                                            )}
                                                          </button>
                </CardTitle>
                <CardDescription>{car.type}</CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                <Image src={car.image_url} alt={car.name} width={220} height={150} />
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faGasPump} className="text-gray-400" style={{ width: '20px', height: '20px' }} />
                  <span className="text-sm">{car.fuel_capacity}</span>
                  <FontAwesomeIcon icon={faGasPump} className="text-gray-400" style={{ width: '20px', height: '20px' }} />
                  <span className="text-sm">{car.transmission}</span>
                  <MdPeopleOutline size={30} className="text-gray-400" />
                  <span className="text-sm flex">{car.seating_capacity}</span>
                </div>
              </CardContent>
              <CardFooter className="w-full flex items-center justify-between">
                <p>
                  {car.price_per_day}/<span className="text-gray-500">day</span>
                </p>
                <button className="bg-[#3563e9] p-2 text-white rounded-md">
                  <a href={`/morecars/id?id=${car.id}`}>Rent Now</a>
                </button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
