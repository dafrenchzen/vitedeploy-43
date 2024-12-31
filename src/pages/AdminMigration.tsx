import { useState } from 'react'
import { beatService } from '../services/beatService'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

export function AdminMigration() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-dark-300 to-dark-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Administration - Migration</h1>

          <div className="space-y-8">
            {/* Section Migration */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Migration des Beats</h2>
                <p className="text-gray-400">
                  Transfère les métadonnées des beats de Storage vers Firestore.
                  Cette opération ne supprime pas les fichiers de Storage.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true)
                      await beatService.migrateBeatsToFirestore()
                      toast.success('Migration réussie !')
                      // Tester la migration
                      await beatService.testMigration()
                    } catch (error) {
                      console.error('Migration error:', error)
                      toast.error('Erreur lors de la migration')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Migration en cours...' : 'Lancer la migration'}
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      setLoading(true)
                      await beatService.testMigration()
                      toast.success('Test terminé ! Vérifiez la console')
                    } catch (error) {
                      console.error('Test error:', error)
                      toast.error('Erreur lors du test')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  Tester la migration
                </Button>
              </div>
            </div>

            {/* Section Résultats */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
              <div className="bg-dark-700 rounded-lg p-4 text-gray-300">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Cliquez sur "Lancer la migration" pour démarrer le processus</li>
                  <li>Attendez que la migration soit terminée</li>
                  <li>Utilisez "Tester la migration" pour vérifier les résultats</li>
                  <li>Consultez la console du navigateur (F12) pour voir les détails</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
