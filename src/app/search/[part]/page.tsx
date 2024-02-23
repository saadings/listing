import Cards from "@/components/Cards";
import NavigationButtons from "@/components/NavigationButtons";

const page = async ({
  params: { part },
  searchParams: { page = "1" },
}: {
  params: { part: string };
  searchParams: { page: string };
}) => {
  const apiKey = process.env.COUNTDOWN_API_KEY;

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    type: "search",
    ebay_domain: "ebay.com",
    search_term: part,
    page: page,
  });

  const url = `https://api.countdownapi.com/request?${queryParams}`;

  // make the http GET request to Countdown API
  const response = await fetch(url);

  const {
    search_results,
    pagination: { has_next_page, next_page, current_page },
  } = await response.json();

  return (
    <main className="flex min-h-lvh select-none flex-col items-center justify-center space-y-8 p-24">
      <NavigationButtons
        current_page={current_page ?? 1}
        next_page={next_page ?? 1}
        has_next_page={has_next_page}
        part={part}
      />
      <Cards searchResults={search_results} />
    </main>
  );
};

export default page;
