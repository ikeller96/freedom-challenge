import * as Headless from "@headlessui/react";
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from "react-router-dom";
import React, { forwardRef } from "react";

type CustomLinkProps = Omit<RouterLinkProps, "to"> & {
    href: RouterLinkProps["to"];
};

export const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>(
    function Link({ href, ...props }, ref) {
        return (
            <Headless.DataInteractive>
                <RouterLink
                    {...props}
                    to={href}
                    ref={ref}
                    className="text-blue-600 hover:underline"
                />
            </Headless.DataInteractive>
        );
    }
);
