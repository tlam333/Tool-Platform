import Checkbox from "@/components/shared/Checkbox";
import { ToolCategories } from "@/lib/constants";

function Filters() {
  const PriceRange = ["0-10", "10-50", "50-100", ">100"];
  const Brands = ["Bosch", "Dewalt", "Makita", "Milwaukee", "Ryobi"];
  return (
    <div>
      <form>
        <p>Tool Category</p>
        {ToolCategories.map((category, index) => (
          <Checkbox title={category} name={category} key={index} />
        ))}
        <p>Price Range</p>
        {PriceRange.map((range, index) => (
          <Checkbox title={range} name={range} key={index} />
        ))}
        <p>Brand</p>
        {Brands.map((brand, index) => (
          <Checkbox title={brand} name={brand} key={index} />
        ))}
      </form>
    </div>
  );
}

export default Filters;
