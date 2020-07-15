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

## Add Neltify CMS

In Netlify app under your site:

1. Under Identity, click Enable identity
2. then click Settings and usage, go to the bottom and click Enable Git Gateway
3. Go to Github -> click on profile picture and select settings on the dropdown. Go to Developer settings -> personal access tokens and click Generate new token
4. under note put `site note - git gateway` and select repo group of credentials. Click Generate token
5. Copy the token and go pack to Netlify dashboard. Under Git Gateway click Edit settings and paste in your new access token.
6. open terminal in your project directory and say `netlify link`. Select the mataching site on Netlify. You need Netlify CLI for this
7. Under identity settings set email tempate paths for all four tempaltes:
   Invitation template: `/emails/invitation.html`
   Confirmation template: `/emails/confirmation.html`
   Recovery template: `/emails/password-recovery.html`
   Email change template: `/emails/email-change.html`
7. Now go back to Identity tab and invite users.

## Enable Netlify Large Media

1. `git lfs install`
2. `git lfs track "static/media/uploads/**"`
3. commit and push
4. `netlify link`
5. `netlify lm:setup`
6. commit and push

You should see your uploads under the Large Media tab in Netlify dashboard. It takes some time for netlify to process media. It if doesn't, try

1. `git lfs update --force`
2. `git lfs push --all origin master`

## Built With

* [Netlify](https://www.netlify.com)
* [Hugo](https://gohugo.io/)
