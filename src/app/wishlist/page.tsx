"use client"; // Add this at the top since this is a client component

import { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { faGalacticRepublic } from "@fortawesome/free-brands-svg-icons";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdPeopleOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

interface Car {
  id: number;
  name: string;
  type: string;
  fuel_capacity: string;
  transmission: string;
  seating_capacity: string;
  price_per_day: string;
  image_url: string;
  tags: string[];
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [wishlistCars, setWishlistCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist cars
  useEffect(() => {
    const fetchWishlistCars = async () => {
      try {
        const response = await fetch("https://678cc7fcf067bf9e24e83478.mockapi.io/carrental");
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const allCars = await response.json();

        // Filter cars that are in wishlist
        const filteredCars = allCars.filter((car: Car) => wishlist.includes(car.id));
        setWishlistCars(filteredCars);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch wishlist cars");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCars();
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
        {wishlistCars.length === 0 ? (
          <p className="text-center col-span-full">Your wishlist is empty!</p>
        ) : (
          wishlistCars.map((car) => (
            <Card key={car.id} className="w-full max-w-[304px] mx-auto h-auto flex flex-col justify-between">
              <CardHeader className="relative">
                <CardTitle className="w-full flex items-center justify-between">
                  {car.name}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => removeFromWishlist(car.id)}
                      className="bg-white p-1 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                    >
                      <FaHeart size={20} className="text-red-500" />
                    </button>
                  </div>
                </CardTitle>
                <CardDescription>{car.type}</CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                <img src={car.image_url} alt={car.name} width={220} height={68} />
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faGasPump} className="text-gray-400" style={{ width: '20px', height: '20px' }} />
                  <span className="text-sm">{car.fuel_capacity}</span>
                  <FontAwesomeIcon icon={faGalacticRepublic} className="text-gray-400" style={{ width: '20px', height: '20px' }} />
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
                  <a href={`/morecars/${car.id}`}>Rent Now</a>
                </button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}  
