create table if not exists "User"
(
	id serial not null
		constraint user_pk
			primary key,
	"firstName" varchar not null,
	"lastName" varchar not null,
	email varchar not null,
	password varchar not null,
	phone varchar not null,
	"isAdmin" boolean
);

alter table "User" owner to matthew_bouch;

create unique index if not exists user_email_uindex
	on "User" (email);

create unique index if not exists user_id_uindex
	on "User" (id);

create unique index if not exists user_phone_uindex
	on "User" (phone);

create table if not exists "Vehicle Type"
(
	id serial not null
		constraint "vehicle type_pk"
			primary key,
	type varchar not null
);

alter table "Vehicle Type" owner to matthew_bouch;

create unique index if not exists "vehicle type_id_uindex"
	on "Vehicle Type" (id);

create table if not exists "State"
(
	abbreviation varchar not null
		constraint state_pk
			primary key,
	name varchar not null
);

alter table "State" owner to matthew_bouch;

create table if not exists "Driver"
(
	id serial not null
		constraint driver_pk
			primary key,
	"userId" integer not null
		constraint driver_user_id_fk
			references "User",
	"licenseNumber" integer not null,
	"licenseState" varchar not null
		constraint driver_state_abbreviation_fk
			references "State"
);

alter table "Driver" owner to matthew_bouch;

create unique index if not exists driver_id_uindex
	on "Driver" (id);

create unique index if not exists driver_licensenumber_uindex
	on "Driver" ("licenseNumber");

create unique index if not exists driver_userid_uindex
	on "Driver" ("userId");

create table if not exists "Vehicle"
(
	id serial not null
		constraint vehicle_pk
			primary key,
	make varchar not null,
	model varchar not null,
	color varchar not null,
	"vehicleTypeId" integer not null
		constraint "vehicle_vehicle type_id_fk"
			references "Vehicle Type",
	capacity integer not null,
	mpg integer not null,
	"licenseState" varchar not null
		constraint vehicle_state_abbreviation_fk
			references "State",
	"licensePlate" varchar not null
);

alter table "Vehicle" owner to matthew_bouch;

create table if not exists "Authorization"
(
	"driverId" integer not null
		constraint authorization_driver_id_fk
			references "Driver",
	"vehicleId" integer not null
		constraint authorization_vehicle_id_fk
			references "Vehicle"
);

alter table "Authorization" owner to matthew_bouch;

create unique index if not exists vehicle_id_uindex
	on "Vehicle" (id);

create table if not exists "Location"
(
	id serial not null
		constraint location_pk
			primary key,
	name varchar not null,
	address varchar not null,
	city varchar not null,
	state varchar not null
		constraint location_state_abbreviation_fk
			references "State",
	"zipCode" varchar not null
);

alter table "Location" owner to matthew_bouch;

create table if not exists "Ride"
(
	id serial not null
		constraint ride_pk
			primary key,
	date date not null,
	time time not null,
	distance double precision not null,
	"fuelPrice" double precision not null,
	fee double precision not null,
	"vehicleId" integer not null
		constraint ride_vehicle_id_fk
			references "Vehicle",
	"fromLocationId" integer not null
		constraint ride_location_id_fk
			references "Location",
	"toLocationId" integer
		constraint ride_location_id_fk_2
			references "Location"
);

alter table "Ride" owner to matthew_bouch;

create table if not exists "Passenger"
(
	"passengerId" integer
		constraint passenger_user_id_fk
			references "User",
	"rideId" integer not null
		constraint passenger_ride_id_fk
			references "Ride"
);

alter table "Passenger" owner to matthew_bouch;

create table if not exists "Drivers"
(
	"driverId" integer not null
		constraint drivers_driver_id_fk
			references "Driver",
	"rideId" integer not null
		constraint drivers_ride_id_fk
			references "Ride"
);

alter table "Drivers" owner to matthew_bouch;

create unique index if not exists ride_id_uindex
	on "Ride" (id);

create unique index if not exists location_address_uindex
	on "Location" (address);

create unique index if not exists location_id_uindex
	on "Location" (id);

