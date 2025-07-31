"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var readline = require("readline");
// Create interface for user input
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Function to convert ZIP code to coordinates
function zipToCoordinates(zipCode) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, latitude, longitude, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("https://api.zippopotam.us/us/".concat(zipCode))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!data || !data.places || data.places.length === 0) {
                        throw new Error("Invalid ZIP code or unable to find coordinates");
                    }
                    latitude = parseFloat(data.places[0].latitude);
                    longitude = parseFloat(data.places[0].longitude);
                    return [2 /*return*/, { latitude: latitude, longitude: longitude }];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error converting ZIP code to coordinates:", error_1.message);
                    // Return default coordinates for Riverside as fallback
                    return [2 /*return*/, { latitude: 33.9533, longitude: -117.3961 }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to generate coordinate matrix for multiple requests
function generateCoordinateMatrix(centerLat, centerLng, radiusKm, numPoints) {
    var coordinates = [];
    coordinates.push({ latitude: centerLat, longitude: centerLng });
    var angleStep = (2 * Math.PI) / (numPoints - 1);
    for (var i = 0; i < numPoints - 1; i++) {
        var angle = i * angleStep;
        var latOffset = (radiusKm / 111) * Math.cos(angle);
        var lngOffset = (radiusKm / 111) * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
        var latitude = centerLat + latOffset;
        var longitude = centerLng + lngOffset;
        coordinates.push({ latitude: latitude, longitude: longitude });
    }
    return coordinates;
}
// Function to fetch data from Facebook Marketplace
function fetchMarketplaceData(query, latitude, longitude, min_price, max_price) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1.default)("https://www.facebook.com/api/graphql/", {
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
                        body: "av=0&__aaid=0&__user=0&__a=1&__req=o&__hs=20228.HYP%3Acomet_loggedout_pkg.2.1...0&dpr=1&__ccg=EXCELLENT&__rev=1023001845&__s=tt054y%3Arrpuho%3Ajdlwmn&__hsi=7506455906387199871&__dyn=7xeUmwlEnwn8K2Wmh0no6u5U4e1ZyUW3q32360CEbo19oe8hw2nVE4W0qa0FE2awpUO0n24oaEd82lwv89k2C1Fwc60D85m1mzXw8W58jwGzE6G1iwJK14xm0zK5o4q0Gpo8o1o8bUGdw46wbS1LwTwNwLwFg2Xwr86C13G1-w8eEb8uwm85K0UE62&__csr=hYcjO8D48QPtHBObKm-QAttmmWDG5RjnoJVF5AUBp96ifGAWxamEtyF8PxSqbxGi8xebwwgNa5UC5Au3adwFGUyEmwwghxB0RDyElBHwxx52F8oAw0n_E097U0yqUswfy0dcw04lRwRwcK0ne0tS8io1RoH403lo0C380cto2DyK0a9wcK0aRw0E_oybxp061wca3a2e039y02cy02S205jU0xW05B403g102iU1I828w2vU0Tww4i0So&__comet_req=15&lsd=AVrinhla05k&jazoest=2997&__spin_r=1023001845&__spin_b=trunk&__spin_t=1747732960&__crn=comet.fbweb.CometMarketplaceSearchRoute&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometMarketplaceSearchContentPaginationQuery&variables=%7B%22count%22%3A24%2C%22cursor%22%3A%22%7B%5C%22pg%5C%22%3A0%2C%5C%22b2c%5C%22%3A%7B%5C%22br%5C%22%3A%5C%22%5C%22%2C%5C%22it%5C%22%3A0%2C%5C%22hmsr%5C%22%3Afalse%2C%5C%22tbi%5C%22%3A0%7D%2C%5C%22c2c%5C%22%3A%7B%5C%22br%5C%22%3A%5C%22Abr7sKjibkdhKA22O0Koj_fWzrYoy0p-cav6as_4KCD7q_8Sn1yVa5ba54elb37OsUWwspzCpLd4os8FgJEYsbPQKaxRmC2hOqSoQFEQXC_92n4-q4yh_KAfjO7g4o1sayyL-EsUqtNmCG5LGwyXt5EkE-HOJOR-kfCVMARDjUB9q5OCAesWvNZlpIW2opzjyCKBx81HpvFa5UgziwayJtmHnaoAbjYQsdxkmJVMic3Fc3Je-BzRXC1oA-ViZE06roRxR1K4xccUV-DsQamvTn5nrPttWwCp0xquOgvXpQncAjVQIFOvLO_lmFd9ZZtez1JgPp0DZfaDxbRpO1lRftBrmmQtACwgedpqnm29JlkhfwQRkkKpSvnohz7TyT0Mrfop-uOL3BmPC5btEVhOkkMUNAbfEt-CnxZY8uG_A0Ot__9LhW9IPsabtA_OtQhGY__7AeOdjJfCGLeUS9z3nD1dPG79Lf9j06ghm8g29DhCbhV6ZDMG3O8jsK755BqtxsyWrgqzdNf2TRX4_oM3AsI18wpg22ZHbUXDVKV_DAjx3QNAXKpPbq7hAMWkIO85zjE%5C%22%2C%5C%22it%5C%22%3A24%2C%5C%22rpbr%5C%22%3A%5C%22%5C%22%2C%5C%22rphr%5C%22%3Afalse%2C%5C%22rmhr%5C%22%3Afalse%7D%2C%5C%22irr%5C%22%3Afalse%2C%5C%22serp_cta%5C%22%3Afalse%2C%5C%22rui%5C%22%3A%5B%5D%2C%5C%22mpid%5C%22%3A%5B%5D%2C%5C%22ubp%5C%22%3Anull%2C%5C%22ncrnd%5C%22%3A0%2C%5C%22irsr%5C%22%3Afalse%2C%5C%22bmpr%5C%22%3A%5B%5D%2C%5C%22bmpeid%5C%22%3A%5B%5D%2C%5C%22nmbmp%5C%22%3Afalse%2C%5C%22skrr%5C%22%3Afalse%2C%5C%22ioour%5C%22%3Afalse%2C%5C%22ise%5C%22%3Afalse%7D%22%2C%22params%22%3A%7B%22bqf%22%3A%7B%22callsite%22%3A%22COMMERCE_MKTPLACE_WWW%22%2C%22query%22%3A%22".concat(query, "%22%7D%2C%22browse_request_params%22%3A%7B%22commerce_enable_local_pickup%22%3Atrue%2C%22commerce_enable_shipping%22%3Atrue%2C%22commerce_search_and_rp_available%22%3Atrue%2C%22commerce_search_and_rp_category_id%22%3A%5B%5D%2C%22commerce_search_and_rp_condition%22%3Anull%2C%22commerce_search_and_rp_ctime_days%22%3Anull%2C%22filter_location_latitude%22%3A").concat(latitude, "%2C%22filter_location_longitude%22%3A").concat(longitude, "%2C%22filter_price_lower_bound%22%3A").concat(min_price, "%2C%22filter_price_upper_bound%22%3A").concat(max_price, "00%2C%22filter_radius_km%22%3A65%7D%2C%22custom_request_params%22%3A%7B%22browse_context%22%3Anull%2C%22contextual_filters%22%3A%5B%5D%2C%22referral_code%22%3Anull%2C%22saved_search_strid%22%3Anull%2C%22search_vertical%22%3A%22C2C%22%2C%22seo_url%22%3Anull%2C%22surface%22%3A%22SEARCH%22%2C%22virtual_contextual_filters%22%3A%5B%5D%7D%7D%2C%22scale%22%3A1%7D&server_timestamps=true&doc_id=10015017365176466")
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
// Main function to collect and process data from multiple locations
function collectDataFromMultipleLocations() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    rl.question('Enter search query (e.g., table, car, sofa): ', function (query) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            rl.question('Enter ZIP code: ', function (zipCode) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    rl.question('Enter search radius ', function (radius) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            rl.question('Enter min ', function (min_price) { return __awaiter(_this, void 0, void 0, function () {
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    rl.question('Enter max ', function (max_price) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _a, latitude, longitude, coordinates, allListings, i, _b, latitude_1, longitude_1, data, listings, error_2, uniqueListings, sortedByPrice, error_3;
                                                        return __generator(this, function (_c) {
                                                            switch (_c.label) {
                                                                case 0:
                                                                    _c.trys.push([0, 10, , 11]);
                                                                    console.log("\nSearching for \"".concat(query, "\" around ZIP code ").concat(zipCode, "..."));
                                                                    return [4 /*yield*/, zipToCoordinates(zipCode)];
                                                                case 1:
                                                                    _a = _c.sent(), latitude = _a.latitude, longitude = _a.longitude;
                                                                    console.log("Using coordinates: Latitude ".concat(latitude, ", Longitude ").concat(longitude));
                                                                    coordinates = generateCoordinateMatrix(latitude, longitude, parseFloat(radius), 5);
                                                                    console.log("Generated ".concat(coordinates.length, " locations for search"));
                                                                    allListings = [];
                                                                    console.log("\nSending requests to Facebook Marketplace...");
                                                                    i = 0;
                                                                    _c.label = 2;
                                                                case 2:
                                                                    if (!(i < coordinates.length)) return [3 /*break*/, 9];
                                                                    _b = coordinates[i], latitude_1 = _b.latitude, longitude_1 = _b.longitude;
                                                                    console.log("\nRequest ".concat(i + 1, "/").concat(coordinates.length, " - Location: ").concat(latitude_1.toFixed(4), ", ").concat(longitude_1.toFixed(4)));
                                                                    _c.label = 3;
                                                                case 3:
                                                                    _c.trys.push([3, 5, , 6]);
                                                                    return [4 /*yield*/, fetchMarketplaceData(query, latitude_1, longitude_1, min_price, max_price)];
                                                                case 4:
                                                                    data = _c.sent();
                                                                    if (data && data.data && data.data.marketplace_search &&
                                                                        data.data.marketplace_search.feed_units &&
                                                                        data.data.marketplace_search.feed_units.edges) {
                                                                        listings = data.data.marketplace_search.feed_units.edges
                                                                            .filter(function (edge) { return edge && edge.node && edge.node.listing && edge.node.listing.marketplace_listing_title; })
                                                                            .map(function (edge) {
                                                                            var _a, _b, _c;
                                                                            return ({
                                                                                title: edge.node.listing.marketplace_listing_title,
                                                                                price: edge.node.listing.listing_price ? edge.node.listing.listing_price.formatted_amount : "N/A",
                                                                                location_city: ((_a = edge.node.listing.location.reverse_geocode) === null || _a === void 0 ? void 0 : _a.city) || "N/A",
                                                                                location_state: ((_b = edge.node.listing.location.reverse_geocode) === null || _b === void 0 ? void 0 : _b.state) || "N/A",
                                                                                id: edge.node.listing.id,
                                                                                url: "https://www.facebook.com/marketplace/item/".concat(edge.node.listing.id),
                                                                                photo_url: edge.node.listing.primary_listing_photo.image.uri,
                                                                                miles: ((_c = edge.node.listing.custom_sub_titles_with_rendering_flags[0]) === null || _c === void 0 ? void 0 : _c.subtitle) || "N/A"
                                                                            });
                                                                        });
                                                                        console.log("Found ".concat(listings.length, " listings at this location"));
                                                                        allListings.push.apply(allListings, listings);
                                                                    }
                                                                    else {
                                                                        console.log("No listings found or unexpected response structure");
                                                                    }
                                                                    return [3 /*break*/, 6];
                                                                case 5:
                                                                    error_2 = _c.sent();
                                                                    console.error("Error fetching data for location ".concat(i + 1, ":"), error_2.message);
                                                                    return [3 /*break*/, 6];
                                                                case 6: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                                                                case 7:
                                                                    _c.sent();
                                                                    _c.label = 8;
                                                                case 8:
                                                                    i++;
                                                                    return [3 /*break*/, 2];
                                                                case 9:
                                                                    uniqueListings = Array.from(new Map(allListings.map(function (item) { return [item.id, item]; })).values());
                                                                    sortedByPrice = __spreadArray([], uniqueListings, true).sort(function (a, b) {
                                                                        var priceA = parseFloat(a.price.replace(/[$,]/g, ''));
                                                                        var priceB = parseFloat(b.price.replace(/[$,]/g, ''));
                                                                        if (isNaN(priceA))
                                                                            return 1;
                                                                        if (isNaN(priceB))
                                                                            return -1;
                                                                        return priceA - priceB;
                                                                    });
                                                                    sortedByPrice.forEach(function (listing, index) {
                                                                        console.log("\n".concat(index + 1, ". ").concat(listing.title));
                                                                        console.log("   Price: ".concat(listing.price));
                                                                        console.log("   Location City: ".concat(listing.location_city));
                                                                        console.log("   Location State: ".concat(listing.location_state));
                                                                        console.log("   Id: ".concat(listing.id));
                                                                        console.log("   Link: ".concat(listing.url));
                                                                        console.log("   URI: ".concat(listing.photo_url));
                                                                        console.log("   Miles: ".concat(listing.miles));
                                                                    });
                                                                    console.log("\n===== RESULTS =====");
                                                                    console.log("Collected ".concat(uniqueListings.length, " unique listings for \"").concat(query, "\" around ZIP ").concat(zipCode));
                                                                    rl.close();
                                                                    resolve(uniqueListings);
                                                                    return [3 /*break*/, 11];
                                                                case 10:
                                                                    error_3 = _c.sent();
                                                                    console.error("Error:", error_3.message);
                                                                    rl.close();
                                                                    resolve([]);
                                                                    return [3 /*break*/, 11];
                                                                case 11: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [2 /*return*/];
                                                });
                                            }); });
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    return [2 /*return*/];
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); });
                })];
        });
    });
}
// Execute the main function
collectDataFromMultipleLocations();
