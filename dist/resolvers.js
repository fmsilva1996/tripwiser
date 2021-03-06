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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
var graphql_scalars_1 = require("graphql-scalars");
var user_model_1 = __importDefault(require("./models/user.model"));
var trip_model_1 = __importDefault(require("./models/trip.model"));
var place_model_1 = __importDefault(require("./models/place.model"));
var flight_model_1 = __importDefault(require("./models/flight.model"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var environment_1 = require("./environment");
var emailservice_1 = require("./emailservice");
function matchSearch(place, searchValue) {
    place = place.toLowerCase();
    searchValue = searchValue.toLowerCase();
    var itemChar = place.charAt(searchValue.length - 1);
    var searchChar = searchValue.charAt(searchValue.length - 1);
    if (itemChar === searchChar) {
        return place.includes(searchValue);
    }
}
function filterOptions(searchValue, options) {
    return options.filter(function (place) {
        return matchSearch(place.cityName, searchValue);
    });
}
exports.resolvers = {
    Query: {
        login: function (_, _a) {
            var email = _a.email, password = _a.password;
            return __awaiter(this, void 0, void 0, function () {
                var user, match;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, user_model_1.default.findOne({ email: email }).populate({
                                path: 'trips',
                                model: trip_model_1.default,
                                populate: [
                                    {
                                        path: 'startLocation endLocation destinations',
                                        model: place_model_1.default,
                                    },
                                    {
                                        path: 'flights',
                                        model: flight_model_1.default,
                                        populate: {
                                            path: 'origin destination',
                                            model: place_model_1.default,
                                        },
                                    },
                                ],
                            })];
                        case 1:
                            user = _b.sent();
                            if (!user)
                                return [2, 'Wrong Username and/or Password'];
                            return [4, bcrypt_1.default.compare(password, user.password)];
                        case 2:
                            match = _b.sent();
                            if (!match)
                                return [2, 'Wrong Username and/or Password'];
                            user.token = jsonwebtoken_1.default.sign({ _id: user._id }, environment_1.environment.secret);
                            return [2, user];
                    }
                });
            });
        },
        places: function (_, _a) {
            var cityNameSearch = _a.cityNameSearch;
            return __awaiter(this, void 0, void 0, function () {
                var placeArr;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, place_model_1.default.find({
                                cityName: { $regex: cityNameSearch, $options: 'gi' },
                            })];
                        case 1:
                            placeArr = _b.sent();
                            return [2, filterOptions(cityNameSearch, placeArr)];
                    }
                });
            });
        },
    },
    Mutation: {
        registerUser: function (_, _a) {
            var userDetails = _a.userDetails;
            return __awaiter(this, void 0, void 0, function () {
                var _b, user;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!userDetails)
                                throw Error('No user details provided!');
                            _b = userDetails;
                            return [4, bcrypt_1.default.hash(userDetails.password, environment_1.environment.saltRound)];
                        case 1:
                            _b.password = _c.sent();
                            return [4, user_model_1.default.create(userDetails)];
                        case 2:
                            user = _c.sent();
                            user.token = jsonwebtoken_1.default.sign({ _id: user._id }, environment_1.environment.secret);
                            emailservice_1.welcomeMail(user.email, user.firstName + " " + user.lastName);
                            return [2, user];
                    }
                });
            });
        },
        updateUser: function (_, userDetails, ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, updatedUserDetails, updatedUser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!userDetails.password) return [3, 2];
                            _a = userDetails;
                            return [4, bcrypt_1.default.hash(userDetails.password, environment_1.environment.saltRound)];
                        case 1:
                            _a.password = _b.sent();
                            _b.label = 2;
                        case 2:
                            updatedUserDetails = Object.assign(ctx.user, userDetails);
                            return [4, user_model_1.default.findOneAndUpdate({ _id: ctx.user._id }, updatedUserDetails, { new: true }).exec()];
                        case 3:
                            updatedUser = _b.sent();
                            return [2, updatedUser];
                    }
                });
            });
        },
        createTrip: function (_, _a, ctx) {
            var tripInput = _a.tripInput;
            return __awaiter(this, void 0, void 0, function () {
                var flights, _i, flights_1, flight, flightDB, trip, userDoc;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!tripInput)
                                throw Error('No trip details provided!');
                            flights = __spreadArrays(tripInput.flights);
                            tripInput.flights = [];
                            _i = 0, flights_1 = flights;
                            _b.label = 1;
                        case 1:
                            if (!(_i < flights_1.length)) return [3, 4];
                            flight = flights_1[_i];
                            return [4, flight_model_1.default.create(flight)];
                        case 2:
                            flightDB = _b.sent();
                            tripInput.flights.push(flightDB._id);
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4: return [4, trip_model_1.default.create(tripInput)];
                        case 5:
                            trip = _b.sent();
                            return [4, user_model_1.default.findOneAndUpdate({ _id: trip.creator }, { $push: { trips: trip._id } }, { new: true }).populate({
                                    path: 'trips',
                                    model: trip_model_1.default,
                                    populate: [
                                        {
                                            path: 'startLocation endLocation destinations',
                                            model: place_model_1.default,
                                        },
                                        {
                                            path: 'flights',
                                            model: flight_model_1.default,
                                            populate: {
                                                path: 'origin destination',
                                                model: place_model_1.default,
                                            },
                                        },
                                    ],
                                })];
                        case 6:
                            userDoc = _b.sent();
                            if (trip.booked)
                                emailservice_1.bookedTrip(ctx.user.email, ctx.user.firstName, trip);
                            return [2, userDoc];
                    }
                });
            });
        },
        updateTrip: function (_, _a, ctx) {
            var _id = _a._id, booked = _a.booked;
            return __awaiter(this, void 0, void 0, function () {
                var trip;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, trip_model_1.default.findById(_id)];
                        case 1:
                            trip = _b.sent();
                            if (!trip)
                                throw new Error('trip not found');
                            trip.booked = booked;
                            if (booked)
                                emailservice_1.bookedTrip(ctx.user.email, ctx.user.firstName, trip);
                            return [4, trip_model_1.default.findOneAndUpdate({ _id: _id }, trip, {
                                    new: true,
                                }).populate([
                                    {
                                        path: 'startLocation endLocation destinations',
                                        model: place_model_1.default,
                                    },
                                    {
                                        path: 'flights',
                                        model: flight_model_1.default,
                                        populate: {
                                            path: 'origin destination',
                                            model: place_model_1.default,
                                        },
                                    },
                                ])];
                        case 2: return [2, _b.sent()];
                    }
                });
            });
        },
        deleteTrip: function (_, _a) {
            var tripId = _a.tripId;
            return __awaiter(this, void 0, void 0, function () {
                var trip, user, updatedUser, populatedUser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!tripId)
                                throw Error('No trip ID provided!');
                            return [4, trip_model_1.default.findById(tripId)];
                        case 1:
                            trip = _b.sent();
                            if (!trip)
                                throw new Error('trip not found');
                            return [4, user_model_1.default.findById(trip.creator)];
                        case 2:
                            user = _b.sent();
                            if (!user)
                                throw new Error('trip has no user smth went really wrong!');
                            user.trips = user.trips.filter(function (trip) { return trip.toString() !== tripId.toString(); });
                            return [4, user.save()];
                        case 3:
                            updatedUser = _b.sent();
                            return [4, updatedUser.populate({
                                    path: 'trips',
                                    model: trip_model_1.default,
                                    populate: [
                                        {
                                            path: 'startLocation endLocation destinations',
                                            model: place_model_1.default,
                                        },
                                        {
                                            path: 'flights',
                                            model: flight_model_1.default,
                                            populate: {
                                                path: 'origin destination',
                                                model: place_model_1.default,
                                            },
                                        },
                                    ],
                                }).execPopulate()];
                        case 4:
                            populatedUser = _b.sent();
                            console.log(populatedUser);
                            return [4, flight_model_1.default.deleteMany({
                                    _id: {
                                        $in: trip.flights,
                                    },
                                })];
                        case 5:
                            _b.sent();
                            return [4, trip_model_1.default.findByIdAndDelete(tripId)];
                        case 6:
                            _b.sent();
                            return [2, populatedUser];
                    }
                });
            });
        },
        placeByAirportId: function (_, _a) {
            var airportId = _a.airportId;
            return __awaiter(this, void 0, void 0, function () {
                var place;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, place_model_1.default.findOne({
                                airportId: airportId,
                            })];
                        case 1:
                            place = _b.sent();
                            return [2, place];
                    }
                });
            });
        },
    },
    DateTime: graphql_scalars_1.DateTimeResolver,
    EmailAddress: graphql_scalars_1.EmailAddressResolver,
    PhoneNumber: graphql_scalars_1.PhoneNumberResolver,
    Currency: graphql_scalars_1.CurrencyResolver,
    PositiveInt: graphql_scalars_1.PositiveIntResolver,
};
