import Car from "../../models/Car";
import connectDB from "../../lib/mongodb";
import CarDetailClient from './CarDetailClient';

async function getCarData(slug) {
  await connectDB();
  const car = await Car.findOne({ slug }).lean();
  return car ? JSON.parse(JSON.stringify(car)) : null;
}

export async function generateMetadata({ params }) {
  const car = await getCarData(params.slug);
  
  if (!car) {
    return {
      title: 'Car Not Found',
      description: 'The requested vehicle could not be found.',
    };
  }

  const title = `${car.make} ${car.model} ${car.modelYear} for Sale${car.location ? ` in ${car.location}` : ''}`;

  let descriptionParts = [`${car.make} ${car.model} ${car.modelYear} model`];
  
  if (car.kms || car.mileage) {
    descriptionParts.push(`with ${car.kms || car.mileage} ${car.unit || 'km'} mileage`);
  }
  
  if (car.fuelType) {
    descriptionParts.push(`${car.fuelType} engine`);
  }
  
  if (car.features && car.features.length > 0) {
    descriptionParts.push(`and ${car.features.join(', ')}`);
  }
  
  const description = descriptionParts.join(', ') + 
    (car.location ? `. Located in ${car.location}` : '') + 
    '. Contact now to buy!';

  return {
    title,
    description,
  };
}

export default function CarDetailPage({ params }) {
  return <CarDetailClient slug={params.slug} />;
}
