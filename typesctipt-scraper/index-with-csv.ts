import fetch from "node-fetch";
import * as readline from "readline";
import * as fs from "fs";

// Type definitions
interface Coordinates {
    latitude: number;
    longitude: number;
}

interface Listing {
    title: string;
    price: string;
    location_city: string;
    location_state: string;
    id: string;
    url: string;
    photo_url: string;
    miles: string;
}

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to convert ZIP code to coordinates
async function zipToCoordinates(zipCode: string): Promise<Coordinates> {
    try {
        const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
        const data = await response.json();

        if (!data || !data.places || data.places.length === 0) {
            throw new Error("Invalid ZIP code or unable to find coordinates");
        }

        const latitude = parseFloat(data.places[0].latitude);
        const longitude = parseFloat(data.places[0].longitude);

        return { latitude, longitude };
    } catch (error: any) {
        console.error("Error converting ZIP code to coordinates:", error.message);
        // Return default coordinates for Riverside as fallback
        return { latitude: 33.9533, longitude: -117.3961 };
    }
}

// Function to generate coordinate matrix for multiple requests
function generateCoordinateMatrix(centerLat: number, centerLng: number, radiusKm: number, numPoints: number): Coordinates[] {
    const coordinates: Coordinates[] = [];
    coordinates.push({ latitude: centerLat, longitude: centerLng });
    const angleStep = (2 * Math.PI) / (numPoints - 1);
    for (let i = 0; i < numPoints - 1; i++) {
        const angle = i * angleStep;
        const latOffset = (radiusKm / 111) * Math.cos(angle);
        const lngOffset = (radiusKm / 111) * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
        const latitude = centerLat + latOffset;
        const longitude = centerLng + lngOffset;
        coordinates.push({ latitude, longitude });
    }
    return coordinates;
}

// Function to fetch data from Facebook Marketplace
async function fetchMarketplaceData(query: string, latitude: number, longitude: number, min_price: string, max_price: string): Promise<any> {
    const response = await fetch("https://www.facebook.com/api/graphql/", {
        headers: {
            "accept": "*/*",
            "content-length": "9000",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "priority": "u=1, i",
            "sec-ch-prefers-color-scheme": "light",
            "sec-ch-ua": '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            "sec-ch-ua-full-version-list": '"Google Chrome";v="135.0.7049.114", "Not-A.Brand";v="8.0.0.0", "Chromium";v="135.0.7049.114"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": '"Windows"',
            "sec-ch-ua-platform-version": '"10.0.0"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-asbd-id": "359341",
            "x-fb-friendly-name": "CometMarketplaceSearchContentPaginationQuery",
            "x-fb-lsd": "AVrinhla05k",
            "cookie": "datr=skgsaNryi9-me0dfjuX0boPc; sb=skgsaIe9GbRNZUvWBEbUHiyj; wd=1920x893",
            "Referer": "https://www.facebook.com/marketplace/category/search/?query=lexus",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "display": "60",
            "city": "Riverside"
        },
        method: "POST",
        body: `av=0&__aaid=0&__user=0&__a=1&__req=o&__hs=20228.HYP%3Acomet_loggedout_pkg.2.1...0&dpr=1&__ccg=EXCELLENT&__rev=1023001845&__s=tt054y%3Arrpuho%3Ajdlwmn&__hsi=7506455906387199871&__dyn=7xeUmwlEnwn8K2Wmh0no6u5U4e1ZyUW3q32360CEbo19oe8hw2nVE4W0qa0FE2awpUO0n24oaEd82lwv89k2C1Fwc60D85m1mzXw8W58jwGzE6G1iwJK14xm0zK5o4q0Gpo8o1o8bUGdw46wbS1LwTwNwLwFg2Xwr86C13G1-w8eEb8uwm85K0UE62&__csr=hYcjO8D48QPtHBObKm-QAttmmWDG5RjnoJVF5AUBp96ifGAWxamEtyF8PxSqbxGi8xebwwgNa5UC5Au3adwFGUyEmwwghxB0RDyElBHwxx52F8oAw0n_E097U0yqUswfy0dcw04lRwRwcK0ne0tS8io1RoH403lo0C380cto2DyK0a9wcK0aRw0E_oybxp061wca3a2e039y02cy02S205jU0xW05B403g102iU1I828w2vU0Tww4i0So&__comet_req=15&lsd=AVrinhla05k&jazoest=2997&__spin_r=1023001845&__spin_b=trunk&__spin_t=1747732960&__crn=comet.fbweb.CometMarketplaceSearchRoute&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometMarketplaceSearchContentPaginationQuery&variables=%7B%22count%22%3A24%2C%22cursor%22%3A%22%7B%5C%22pg%5C%22%3A0%2C%5C%22b2c%5C%22%3A%7B%5C%22br%5C%22%3A%5C%22%5C%22%2C%5C%22it%5C%22%3A0%2C%5C%22hmsr%5C%22%3Afalse%2C%5C%22tbi%5C%22%3A0%7D%2C%5C%22c2c%5C%22%3A%7B%5C%22br%5C%22%3A%5C%22Abr7sKjibkdhKA22O0Koj_fWzrYoy0p-cav6as_4KCD7q_8Sn1yVa5ba54elb37OsUWwspzCpLd4os8FgJEYsbPQKaxRmC2hOqSoQFEQXC_92n4-q4yh_KAfjO7g4o1sayyL-EsUqtNmCG5LGwyXt5EkE-HOJOR-kfCVMARDjUB9q5OCAesWvNZlpIW2opzjyCKBx81HpvFa5UgziwayJtmHnaoAbjYQsdxkmJVMic3Fc3Je-BzRXC1oA-ViZE06roRxR1K4xccUV-DsQamvTn5nrPttWwCp0xquOgvXpQncAjVQIFOvLO_lmFd9ZZtez1JgPp0DZfaDxbRpO1lRftBrmmQtACwgedpqnm29JlkhfwQRkkKpSvnohz7TyT0Mrfop-uOL3BmPC5btEVhOkkMUNAbfEt-CnxZY8uG_A0Ot__9LhW9IPsabtA_OtQhGY__7AeOdjJfCGLeUS9z3nD1dPG79Lf9j06ghm8g29DhCbhV6ZDMG3O8jsK755BqtxsyWrgqzdNf2TRX4_oM3AsI18wpg22ZHbUXDVKV_DAjx3QNAXKpPbq7hAMWkIO85zjE%5C%22%2C%5C%22it%5C%22%3A24%2C%5C%22rpbr%5C%22%3A%5C%22%5C%22%2C%5C%22rphr%5C%22%3Afalse%2C%5C%22rmhr%5C%22%3Afalse%7D%2C%5C%22irr%5C%22%3Afalse%2C%5C%22serp_cta%5C%22%3Afalse%2C%5C%22rui%5C%22%3A%5B%5D%2C%5C%22mpid%5C%22%3A%5B%5D%2C%5C%22ubp%5C%22%3Anull%2C%5C%22ncrnd%5C%22%3A0%2C%5C%22irsr%5C%22%3Afalse%2C%5C%22bmpr%5C%22%3A%5B%5D%2C%5C%22bmpeid%5C%22%3A%5B%5D%2C%5C%22nmbmp%5C%22%3Afalse%2C%5C%22skrr%5C%22%3Afalse%2C%5C%22ioour%5C%22%3Afalse%2C%5C%22ise%5C%22%3Afalse%7D%22%2C%22params%22%3A%7B%22bqf%22%3A%7B%22callsite%22%3A%22COMMERCE_MKTPLACE_WWW%22%2C%22query%22%3A%22${query}%22%7D%2C%22browse_request_params%22%3A%7B%22commerce_enable_local_pickup%22%3Atrue%2C%22commerce_enable_shipping%22%3Atrue%2C%22commerce_search_and_rp_available%22%3Atrue%2C%22commerce_search_and_rp_category_id%22%3A%5B%5D%2C%22commerce_search_and_rp_condition%22%3Anull%2C%22commerce_search_and_rp_ctime_days%22%3Anull%2C%22filter_location_latitude%22%3A${latitude}%2C%22filter_location_longitude%22%3A${longitude}%2C%22filter_price_lower_bound%22%3A${min_price}%2C%22filter_price_upper_bound%22%3A${max_price}00%2C%22filter_radius_km%22%3A65%7D%2C%22custom_request_params%22%3A%7B%22browse_context%22%3Anull%2C%22contextual_filters%22%3A%5B%5D%2C%22referral_code%22%3Anull%2C%22saved_search_strid%22%3Anull%2C%22search_vertical%22%3A%22C2C%22%2C%22seo_url%22%3Anull%2C%22surface%22%3A%22SEARCH%22%2C%22virtual_contextual_filters%22%3A%5B%5D%7D%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=10015017365176466`
    });
    const data = await response.json();
    return data;
}

function saveListingsToCSV(listings: Listing[], filename: string) {
    const header = [
        "title",
        "price",
        "location_city",
        "location_state",
        "id",
        "url",
        "photo_url",
        "miles"
    ];
    const rows = listings.map(listing =>
        header.map(field => `"${(listing as any)[field]?.toString().replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = header.join(",") + "\n" + rows.join("\n");
    fs.writeFileSync(filename, csvContent, { encoding: "utf8" });
    console.log(`\nSaved ${listings.length} listings to ${filename}`);
}

// Main function to collect and process data from multiple locations
async function collectDataFromMultipleLocations(): Promise<Listing[]> {
    return new Promise((resolve) => {
        rl.question('Enter search query (e.g., table, car, sofa): ', async (query: string) => {
            rl.question('Enter ZIP code: ', async (zipCode: string) => {
                rl.question('Enter search radius ', async (radius: string) => {
                    rl.question('Enter min ', async (min_price: string) => {
                        rl.question('Enter max ', async (max_price: string) => {
                            try {
                                console.log(`\nSearching for "${query}" around ZIP code ${zipCode}...`);
                                const { latitude, longitude } = await zipToCoordinates(zipCode);
                                console.log(`Using coordinates: Latitude ${latitude}, Longitude ${longitude}`);
                                const coordinates = generateCoordinateMatrix(latitude, longitude, parseFloat(radius), 5);
                                console.log(`Generated ${coordinates.length} locations for search`);
                                const allListings: Listing[] = [];
                                console.log("\nSending requests to Facebook Marketplace...");
                                for (let i = 0; i < coordinates.length; i++) {
                                    const { latitude, longitude } = coordinates[i];
                                    console.log(`\nRequest ${i + 1}/${coordinates.length} - Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                    try {
                                        const data = await fetchMarketplaceData(query, latitude, longitude, min_price, max_price);
                                        if (data && data.data && data.data.marketplace_search &&
                                            data.data.marketplace_search.feed_units &&
                                            data.data.marketplace_search.feed_units.edges) {
                                            const listings: Listing[] = data.data.marketplace_search.feed_units.edges
                                                .filter((edge: any) => edge && edge.node && edge.node.listing && edge.node.listing.marketplace_listing_title)
                                                .map((edge: any) => ({
                                                    title: edge.node.listing.marketplace_listing_title,
                                                    price: edge.node.listing.listing_price ? edge.node.listing.listing_price.formatted_amount : "N/A",
                                                    location_city: edge.node.listing.location.reverse_geocode?.city || "N/A",
                                                    location_state: edge.node.listing.location.reverse_geocode?.state || "N/A",
                                                    id: edge.node.listing.id,
                                                    url: `https://www.facebook.com/marketplace/item/${edge.node.listing.id}`,
                                                    photo_url: edge.node.listing.primary_listing_photo.image.uri,
                                                    miles: edge.node.listing.custom_sub_titles_with_rendering_flags[0]?.subtitle || "N/A"
                                                }));
                                            console.log(`Found ${listings.length} listings at this location`);
                                            allListings.push(...listings);
                                        } else {
                                            console.log("No listings found or unexpected response structure");
                                        }
                                    } catch (error: any) {
                                        console.error(`Error fetching data for location ${i + 1}:`, error.message);
                                    }
                                    await new Promise(r => setTimeout(r, 1000));
                                }
                                const uniqueListings: Listing[] = Array.from(
                                    new Map(allListings.map(item => [item.id, item])).values()
                                );
                                const sortedByPrice: Listing[] = [...uniqueListings].sort((a, b) => {
                                    const priceA = parseFloat(a.price.replace(/[$,]/g, ''));
                                    const priceB = parseFloat(b.price.replace(/[$,]/g, ''));
                                    if (isNaN(priceA)) return 1;
                                    if (isNaN(priceB)) return -1;
                                    return priceA - priceB;
                                });
                                sortedByPrice.forEach((listing, index) => {
                                    console.log(`\n${index + 1}. ${listing.title}`);
                                    console.log(`   Price: ${listing.price}`);
                                    console.log(`   Location City: ${listing.location_city}`);
                                    console.log(`   Location State: ${listing.location_state}`);
                                    console.log(`   Id: ${listing.id}`);
                                    console.log(`   Link: ${listing.url}`);
                                    console.log(`   URI: ${listing.photo_url}`);
                                    console.log(`   Miles: ${listing.miles}`);
                                });
                                console.log(`\n===== RESULTS =====`);
                                console.log(`Collected ${uniqueListings.length} unique listings for "${query}" around ZIP ${zipCode}`);
                                saveListingsToCSV(uniqueListings, 'output.csv');
                                rl.close();
                                resolve(uniqueListings);
                            } catch (error: any) {
                                console.error("Error:", error.message);
                                rl.close();
                                resolve([]);
                            }
                        });
                    });
                });
            });
        });
    });
}

// Execute the main function
collectDataFromMultipleLocations();