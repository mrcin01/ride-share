INSERT INTO public."Authorization" ("driverId", "vehicleId") VALUES (4, 1);
INSERT INTO public."Authorization" ("driverId", "vehicleId") VALUES (5, 2);
INSERT INTO public."Authorization" ("driverId", "vehicleId") VALUES (6, 3);

INSERT INTO public."Driver" (id, "userId", "licenseNumber", "licenseState") VALUES (4, 1, 12345, 'DE');
INSERT INTO public."Driver" (id, "userId", "licenseNumber", "licenseState") VALUES (5, 2, 67890, 'IN');
INSERT INTO public."Driver" (id, "userId", "licenseNumber", "licenseState") VALUES (6, 3, 54321, 'PA');

INSERT INTO public."Drivers" ("driverId", "rideId") VALUES (4, 1);
INSERT INTO public."Drivers" ("driverId", "rideId") VALUES (5, 3);
INSERT INTO public."Drivers" ("driverId", "rideId") VALUES (6, 2);

INSERT INTO public."Location" (id, name, address, city, state, "zipCode") VALUES (3, 'Summitville', '3949E 1450N', 'Summitville', 'IN', '46070');
INSERT INTO public."Location" (id, name, address, city, state, "zipCode") VALUES (4, 'Philadelphia', 'Philadelphia', 'Philadelphia', 'PA', '19019');
INSERT INTO public."Location" (id, name, address, city, state, "zipCode") VALUES (2, 'Wilmington', 'Wilmington', 'Wilmington', 'DE', '19808');
INSERT INTO public."Location" (id, name, address, city, state, "zipCode") VALUES (5, 'Upland', 'Upland', 'Upland', 'IN', '46989');

INSERT INTO public."Passenger" ("passengerId", "rideId") VALUES (1, 2);
INSERT INTO public."Passenger" ("passengerId", "rideId") VALUES (3, 1);

INSERT INTO public."Ride" (id, date, time, distance, "fuelPrice", fee, "vehicleId", "fromLocationId", "toLocationId") VALUES (1, '2020-11-23', '08:00:00', 250, 50, 25, 1, 5, 2);
INSERT INTO public."Ride" (id, date, time, distance, "fuelPrice", fee, "vehicleId", "fromLocationId", "toLocationId") VALUES (2, '2020-11-22', '09:00:00', 230, 65, 30, 3, 5, 4);
INSERT INTO public."Ride" (id, date, time, distance, "fuelPrice", fee, "vehicleId", "fromLocationId", "toLocationId") VALUES (3, '2020-11-23', '03:00:00', 40, 10, 5, 2, 5, 3);

INSERT INTO public."State" (abbreviation, name) VALUES ('DE', 'Delaware');
INSERT INTO public."State" (abbreviation, name) VALUES ('IN', 'Indiana');
INSERT INTO public."State" (abbreviation, name) VALUES ('PA', 'Pennsylvania');

INSERT INTO public."User" (id, "firstName", "lastName", email, password, phone, "isAdmin") VALUES (1, 'Matthew', 'Bouch', 'matthew_bouch@taylor.edu', 'passqword', '1234567890', true);
INSERT INTO public."User" (id, "firstName", "lastName", email, password, phone, "isAdmin") VALUES (2, 'Brickson', 'Cain', 'brickson_cain@taylor.edu', 'yeet', 'yeet', true);
INSERT INTO public."User" (id, "firstName", "lastName", email, password, phone, "isAdmin") VALUES (3, 'Trevor', 'Mitchel', 'trevor_mitchel', 'frogs', '0987654321', false);

INSERT INTO public."Vehicle" (id, make, model, color, "vehicleTypeId", capacity, mpg, "licenseState", "licensePlate") VALUES (1, 'Ford', 'Focus', 'Silver', 1, 4, 30, 'DE', 'IROCK');
INSERT INTO public."Vehicle" (id, make, model, color, "vehicleTypeId", capacity, mpg, "licenseState", "licensePlate") VALUES (2, 'Chevy', 'Caprice', 'White', 4, 7, 25, 'IN', 'IROCKMORE');
INSERT INTO public."Vehicle" (id, make, model, color, "vehicleTypeId", capacity, mpg, "licenseState", "licensePlate") VALUES (3, 'Ford', 'F150', 'Silver', 3, 6, 20, 'PA', 'IDONTROCK');

INSERT INTO public."Vehicle Type" (id, type) VALUES (1, 'Car');
INSERT INTO public."Vehicle Type" (id, type) VALUES (2, 'Minivan');
INSERT INTO public."Vehicle Type" (id, type) VALUES (3, 'Truck');
INSERT INTO public."Vehicle Type" (id, type) VALUES (4, 'Station wagon');
