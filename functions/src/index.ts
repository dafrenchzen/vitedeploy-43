import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

admin.initializeApp()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendBookingConfirmation = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data()
    const { bookingId } = context.params

    try {
      // Récupérer les informations de l'utilisateur
      const userRecord = await admin.auth().getUser(booking.userId)
      const userEmail = userRecord.email

      if (!userEmail) {
        throw new Error('No user email found')
      }

      const formattedDate = format(new Date(booking.date), 'EEEE d MMMM yyyy', {
        locale: fr,
      })

      // Template de l'email
      const mailOptions = {
        from: '43ART Studio <noreply@43art-studio.com>',
        to: userEmail,
        subject: 'Confirmation de votre réservation - 43ART Studio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #7e22ce, #ec4899); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">43ART Studio</h1>
            </div>
            
            <div style="padding: 20px; background-color: #1f1f1f; color: white;">
              <h2 style="color: #ec4899;">Réservation confirmée !</h2>
              
              <div style="background-color: #2d2d2d; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #7e22ce; margin-top: 0;">Détails de votre session</h3>
                <p><strong>Date :</strong> ${formattedDate}</p>
                <p><strong>Heure :</strong> ${booking.startTime}</p>
                <p><strong>Type de session :</strong> ${booking.type}</p>
                ${
                  booking.notes
                    ? `<p><strong>Notes :</strong> ${booking.notes}</p>`
                    : ''
                }
              </div>
              
              <div style="background-color: #2d2d2d; padding: 20px; border-radius: 8px;">
                <h3 style="color: #7e22ce; margin-top: 0;">Informations importantes</h3>
                <ul style="padding-left: 20px;">
                  <li>Arrivez 10 minutes avant votre session</li>
                  <li>Apportez votre matériel si nécessaire</li>
                  <li>En cas d'empêchement, prévenez-nous 24h à l'avance</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.APP_URL}/booking/${bookingId}" 
                   style="background-color: #7e22ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                  Voir les détails de la réservation
                </a>
              </div>
            </div>
            
            <div style="background-color: #2d2d2d; padding: 20px; text-align: center; color: #666;">
              <p>43ART Studio - Votre studio d'enregistrement professionnel</p>
              <p style="font-size: 12px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
          </div>
        `,
      }

      // Envoyer l'email
      await transporter.sendMail(mailOptions)

      return null
    } catch (error) {
      console.error('Error sending email:', error)
      return null
    }
  })
