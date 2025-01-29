"use client"; // Add this at the top since this is a client component

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { faGalacticRepublic } from "@fortawesome/free-brands-svg-icons";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdPeopleOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import React from "react";

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

        // Retrieve wishlist from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        // Filter cars that are in wishlist
        const filteredCars = allCars.filter((car: Car) => savedWishlist.includes(car.id));
        setWishlistCars(filteredCars);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch wishlist cars");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCars();
  }, []);


  const handleRemoveFromWishlist = (carId: number) => {
    // Get wishlist from localStorage
    let savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    savedWishlist = savedWishlist.filter((id: number) => id !== carId);
    localStorage.setItem('wishlist', JSON.stringify(savedWishlist));
    setWishlistCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {wishlistCars.length === 0 ? (
          <p className="text-center col-span-full">Your wishlist is empty!</p>
        ) : (
          wishlistCars.map((car) => (
            <Card key={car.id} className="w-full max-w-[304px] mx-auto h-auto flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="relative">
                <CardTitle className="w-full flex items-center justify-between text-lg font-semibold text-gray-900">
                  {car.name}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleRemoveFromWishlist(car.id)}
                      className="bg-white p-1 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                    >
                      <FaHeart size={20} className="text-red-500" />
                    </button>
                  </div>
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">{car.type}</CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                <img src={car.image_url} alt={car.name} width={220} height={68} className="object-cover rounded-lg" />
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FontAwesomeIcon icon={faGasPump} className="w-5 h-5 text-gray-400" />
                  <span>{car.fuel_capacity}</span>
                  <FontAwesomeIcon icon={faGalacticRepublic} className="w-5 h-5 text-gray-400" />
                  <span>{car.transmission}</span>
                  <MdPeopleOutline size={24} className="text-gray-400" />
                  <span>{car.seating_capacity}</span>
                </div>
              </CardContent>
              <CardFooter className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
                <p className="text-lg font-semibold">
                  {car.price_per_day}/<span className="text-gray-500">day</span>
                </p>
                <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-all">
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
