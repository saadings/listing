import React from "react";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const PreviousButton = () => {
  return (
    <Button>
      <div className="flex flex-row space-x-4">
        <ArrowLeftIcon className="size-5" />
        Previous
      </div>
    </Button>
  );
};

const NextButton = () => {
  return (
    <Button>
      <div className="flex flex-row space-x-4">
        Next
        <ArrowRightIcon className="size-5" />
      </div>
    </Button>
  );
};

const NavigationButtons = ({
  part,
  current_page,
  next_page,
  has_next_page,
}: {
  part: string;
  current_page: number;
  next_page: number;
  has_next_page: boolean;
}) => {
  const isPreviousDisabled = current_page < 2;
  const isNextDisabled = !has_next_page;

  return (
    <div className="flex flex-row space-x-8">
      {isPreviousDisabled ? (
        <Button disabled>
          <div className="flex flex-row items-center justify-between">
            <ArrowLeftIcon className="size-5" />
            Previous
          </div>
        </Button>
      ) : (
        <Link href={`/search/${part}?page=${current_page - 1}`}>
          <PreviousButton />
        </Link>
      )}
      {isNextDisabled ? (
        <Button disabled>
          <div className="flex flex-row items-center justify-between">
            Next
            <ArrowRightIcon className="size-5" />
          </div>
        </Button>
      ) : (
        <Link href={`/search/${part}?page=${next_page}`}>
          <NextButton />
        </Link>
      )}
    </div>
  );
};

export default NavigationButtons;
