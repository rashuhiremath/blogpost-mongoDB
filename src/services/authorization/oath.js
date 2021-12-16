import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import authorModel from "../authors/schema.js"
import { tokenAuthenticate } from "./tools.js"

const googleCloudStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      // This callback is executed when Google gives us a successful response
      // We are receiving also some informations about the user from Google (profile, email)

      console.log("GOOGLE PROFILE: ", profile)


      // 1. Check if the user is already in our db
     // const author = await authorModel.findOne({ googleId: profile.id })

    //   if (author) {
    //     // 2. If the user is already there --> create some tokens for him/her
    //     console.log(author)
    //     const tokens = await tokenAuthenticate(author)
    //     console.log(tokens)
    //     // 4. passportNext()
    //     passportNext(null, { tokens })
    //   } else {
    //     // 3. If it is not --> add user to db and then create some tokens for him/her

    //     const newAuthor = new authorModel({
    //       name: profile.name.givenName,
    //       email: profile.emails[0].value,
    //       googleId: profile.id,
    //       password:profile.password
    //     })

    //     console.log("hereis my new author",newAuthor)


    //     const savedAuthor = await newAuthor .save()

    //     const tokens = await tokenAuthenticate(savedAuthor)

    //     // 4. passportNext()
    //     passportNext(null, { tokens })
    //   }
     } catch (error) {
      passportNext(error)
     }
  }
)

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data)
})

export default googleCloudStrategy