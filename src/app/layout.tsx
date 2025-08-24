import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
	title: 'Anonymous Chat App',
	description: 'Anonymous messaging application',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}


