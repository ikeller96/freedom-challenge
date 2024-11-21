import React from "react";

export const Spinner: React.FC = () => (
	<div className="flex justify-center items-center">
			<div className="w-5 h-5 border-2 border-t-transparent border-gray-300 rounded-full animate-spin"></div>
	</div>
);