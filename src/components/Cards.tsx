import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const Card = ({
  title,
  link,
  imageUrl,
  price,
}: {
  title: string;
  link: string;
  imageUrl: string;
  price: string;
}) => {
  return (
    <div className="flex size-11/12 flex-col items-center justify-center space-y-4 rounded border p-8 shadow-xl shadow-black/30 dark:border-white/15 dark:shadow-white/30">
      <div>
        <Image
          src={imageUrl}
          alt={title}
          width={200}
          height={200}
          className="size-11/12 rounded"
          priority
        />
      </div>
      <div>
        <h2 className="line-clamp-1">{title}</h2>
      </div>
      <div className="flex w-full items-center justify-between">
        <Button variant={"outline"}>{price}</Button>
        <Link href={link} target="_blank" rel="noopener noreferrer">
          <Button>Visit Ebay</Button>
        </Link>
      </div>
    </div>
  );
};

const Cards = ({
  searchResults,
}: {
  searchResults: [
    {
      epid: string;
      title: string;
      link: string;
      image: string;
      price: {
        raw: string;
      };
    },
  ];
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {searchResults.map(({ epid, title, link, image, price }) => (
        <Card
          key={epid}
          title={title}
          link={link}
          imageUrl={image}
          price={price.raw}
        />
      ))}
    </div>
  );
};

export default Cards;
