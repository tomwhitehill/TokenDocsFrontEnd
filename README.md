# Document Search Project

## Overview

This project implements a document search system with customizable metadata filtering. It's built using React and Next.js 15, leveraging React Query for efficient data fetching and state management.

## Features

- Search documents by custom metadata
- Filter documents by document type
- Real-time search with debounce
- Download functionality for documents
- Responsive design with accessibility features

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/tomwhitehill/TokenDocsFrontEnd.git
   ```

2. Navigate to the project directory:
   ```
   cd TokenDocsFrontEnd
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=your_api_base_url
   NEXT_PUBLIC_SUBSCRIPTION_KEY=your_subscription_key
   NEXT_PUBLIC_API_VERSION=your_api_version
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## API Integration

The project uses a custom API for document operations. Ensure that the API endpoints are correctly set up and the necessary environment variables are provided.

## License

This project is licensed under the MIT License.