"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationButtons = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const shouldShowPage = (pageNumber: number, totalPages: number) => {
    // Define the number of pages you want to show around the current page
    const pageThreshold = 2;
    // Always show the first two pages and the last two pages
    if (pageNumber <= 2 || pageNumber > totalPages - 2) return true;
    // Show the currentPage - pageThreshold to currentPage + pageThreshold
    if (
      pageNumber >= currentPage - pageThreshold &&
      pageNumber <= currentPage + pageThreshold
    )
      return true;
    // Don't show pages otherwise
    return false;
  };

  const handlePageClick = (pageNumber: number) => {
    // Create a new URLSearchParams object from the current searchParams
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());

    // Construct the URL string with updated search parameters
    const url = `${pathname}?${params.toString()}`;

    // Perform the navigation
    router.push(url);
  };

  const handlePreviousClick = () => {
    if (currentPage === 1) return;
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", (currentPage - 1).toString());

    const url = `${pathname}?${params.toString()}`;

    router.push(url);
  };

  const handleNextClick = () => {
    if (currentPage === totalPages) return;
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", (currentPage + 1).toString());

    const url = `${pathname}?${params.toString()}`;

    router.push(url);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem onClick={handlePreviousClick}>
          <PaginationPrevious href="#" />
        </PaginationItem>

        {pages.map((pageNumber) => {
          if (shouldShowPage(pageNumber, totalPages)) {
            return (
              <PaginationItem
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
              >
                <PaginationLink
                  href={"#"}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          }

          // For ellipsis
          if (
            (pageNumber === currentPage - 3 && currentPage - 3 > 1) ||
            (pageNumber === currentPage + 3 && currentPage + 3 < totalPages)
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return null; // Don't render anything for pages we don't want to show
        })}

        <PaginationItem onClick={handleNextClick}>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationButtons;
