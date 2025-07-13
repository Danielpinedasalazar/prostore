"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import type { Product } from "@/types";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            height={320}
            width={320}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            priority={true}
          />
        </Link>

        {/* Overlay Actions */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-4 right-4 space-y-2">
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600">
            Only {product.stock} left
          </Badge>
        )}

        {product.stock === 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-xs font-medium text-purple-700 border-purple-200"
          >
            {product.brand}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-semibold text-gray-900 hover:text-purple-700 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <span className="text-red-600 font-semibold">Out Of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
