import { Button, Container, CardGroup, Card } from "react-bootstrap";
import { CheckCircleFill, CircleFill } from "react-bootstrap-icons";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../src/components/Layout";

const HowTo = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>About OES</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta
                    name="google-site-verification"
                    content="4g7sVHEgHkqmu_q066ocloQj3YI8pOz7IHC8ibisQHk"
                />
                <meta name="title" content="OES" />
                <meta
                    name="description"
                    content="Free and open source meeting poll tool"
                />
                <meta
                    property="og:description"
                    content="Free and open source meeting poll tool"
                />
                <meta property="og:image" content="/banner.png" />
                <meta property="twitter:image" content="/banner.png" />
            </Head>
            <Layout>
                <Container className="how-to-container">
                    <span className="how-to-features title">
                        OES - Polling and Meeting Tool
                    </span>
                    <span className="how-to-features desc">
                        Our powerful platform makes it easy to poll and plan meetings, book appointments, and more - all in one place with just a few clicks. Try OES today and discover a smarter way to plan!
                    </span>
                    <img src="/about.jpeg" alt="Your image description" style={{ display: "block", margin: "0 auto", maxWidth: "90%", marginTop: "30px" }} />
                </Container>
                <Container className="how-to-container cta">

                </Container>
            </Layout>
        </>
    );
};

export default HowTo;
