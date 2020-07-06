[![Netlify Status](https://api.netlify.com/api/v1/badges/258a10dd-ef97-4e72-80ed-9d7efc84d8a8/deploy-status)](https://app.netlify.com/sites/hugo-template/deploys)

# Hugo Template

Template project for sites built with Hugo & Netlify

* Client:
* Netlify URL: https://hugo-template.netlify.app/
* Production URL:

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

You need Hugo installed on your machine: <https://gohugo.io/getting-started/quick-start/>

If this is your first time running the project, run

`npm install`

When you have that, just run

`hugo server`

and open your local site on `http://localhost:1313/`

## Deployment

To deploy to production, push to `master` branch

### Development URL

There is no development URL out of the box. To create this environment, follow these steps:

1. create branch `develop`
2. Go to Netlify dashboard -> your site -> Settings -> Build & deploy -> Deploy contexts -> Edit settings
3. Under Branch deploys select Let me add individual branches and add `develop`
4. push some code to `develop` branch and see it on https://develop--YOUR-SITE-NAME.netlify.app

## Built With

* [Netlify](https://www.netlify.com)
* [Hugo](https://gohugo.io/)
