# Project Name

## Description

Imagine there is an app created for vaccine registration (similar to that of Arogyasetu Cowin part).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- MongoDB installed and running
- Git installed on your local machine

## Getting Started

To get a local copy up and running, follow these simple steps.

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/Brahma29/runo_assessment.git
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Add the environment variables
   ```sh
   PORT=
   MONGO_URI=
   JWT_SECRET=
   NODE_ENV=
   ```
4. Run the server
   ```sh
   npm run dev
   ```

## Models

### Drive Model

The `Drive` model represents a drive entity in the system.

#### Schema

- `startDate`: Date - The start date of the drive.
- `endDate`: Date - The end date of the drive.
- `startTime`: String - The start time of the drive.
- `endTime`: String - The end time of the drive.
- `slotCapacity`: Number - The capacity of each time slot in the drive.
- `slotDuration`: Number - The duration of each time slot in minutes.

### Slot Model

The `Slot` model represents a time slot for appointments within a drive.

#### Schema

- `drive`: ObjectId - Reference to the Drive model representing the associated drive.
- `date`: Date - The date of the time slot.
- `time`: String - The time of the time slot.
- `availableDoses`: Number - The number of available doses for the time slot.
- `bookings`: Array - An array containing user bookings within the time slot, each containing:
  - `user`: ObjectId - Reference to the User model representing the user who booked the slot.
  - `dose`: Number - The dose number booked by the user.

### User Model

The `User` model represents a user in the system.

#### Schema

- `firstName`: String - The first name of the user.
- `lastName`: String - The last name of the user.
- `phoneNumber`: String - The phone number of the user (unique).
- `age`: Number - The age of the user.
- `pincode`: String - The pincode of the user's location.
- `aadharNo`: String - The Aadhar number of the user (unique).
- `vaccinationStatus`: String - The vaccination status of the user. Possible values: "notVaccinated", "firstDoseCompleted", "fullyVaccinated" (default: "notVaccinated").
- `password`: String - The hashed password of the user.
- `registeredSlot`: ObjectId - Reference to the Slot model representing the slot the user is registered for.

## Endpoints

### Register User

**Route:** `POST /api/users/`

Registers a new user in the system.

#### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "age": 30,
  "pincode": "12345",
  "aadharNo": "123456789012",
  "password": "yourpassword"
}
```

### Login User

**Route:** `POST /api/users/`

Login user in the system.

#### Request Body

```json
{
  "phoneNumber": "1234567890",
  "password": "yourpassword"
}
```

### Slot Book

**Route:** `POST /api/users/slot/book`

Booking a time slot for vaccination.

#### Request Body

```json
{
  "time": "10:00 AM",
  "date": "2024-05-12",
  "driveId": "663a50f803261a231aa5c04b",
  "doseNo": 2
}
```

### Update Slot

**Route:** `POST /api/users/slot/update`

Updating booked time slot for vaccination.

#### Request Body

```json
{
  "time": "10:00 AM",
  "date": "2024-05-12",
  "driveId": "663a50f803261a231aa5c04b"
}
```
