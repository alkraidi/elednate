import { Hero } from '@/components/home/hero';
import { NewArrivals } from '@/components/home/new-arrivals';
import { CategoryTiles } from '@/components/home/category-tiles';
import { ShopByCategory } from '@/components/home/shop-by-category';
import { OurGemstones } from '@/components/home/our-gemstones';
import { HighEndCollection } from '@/components/home/high-end-collection';
import { AboutStrip } from '@/components/home/about-strip';
import { ServicesRow } from '@/components/home/services-row';

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <CategoryTiles />
      <ShopByCategory />
      <OurGemstones />
      <HighEndCollection />
      <AboutStrip />
      <ServicesRow />
    </>
  );
}
