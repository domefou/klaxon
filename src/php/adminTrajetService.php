<?php

class TrajetService {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function createTrajet(array $data): array {
        // Extraction des données
        $id_user = trim($data['id_user'] ?? '');
        $id_agence_depart = trim($data['id_agence_depart'] ?? '');
        $id_agence_arrivee = trim($data['id_agence_arrivee'] ?? '');
        $date_depart = trim($data['date_depart'] ?? '');
        $heure_depart = trim($data['heure_depart'] ?? '');
        $date_arrivee = trim($data['date_arrivee'] ?? '');
        $heure_arrivee = trim($data['heure_arrivee'] ?? '');
        $place = trim($data['place'] ?? '');

        try {
            // Vérifier que l'utilisateur existe
            $stmt = $this->db->prepare("SELECT id_user FROM users WHERE id_user = :id");
            $stmt->execute(['id' => $id_user]);
            if (!$stmt->fetch()) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Utilisateur introuvable avec l'ID {$id_user}"
                ];
            }

            $departDateTime = strtotime("$date_depart $heure_depart");
            $arriveeDateTime = strtotime("$date_arrivee $heure_arrivee");

            if ($arriveeDateTime <= $departDateTime) {
                return [
                    'status' => 400,
                    'success' => false,
                    'errorMessage' => "La date et l'heure d'arrivée doivent être après celles du départ."
                ];
            }

            $stmt = $this->db->prepare("
                INSERT INTO trajets (
                    id_user, id_agence_depart, date_depart, heure_depart,
                    id_agence_arrivee, date_arrivee, heure_arrivee, place
                ) VALUES (
                    :id_user, :id_agence_depart, :date_depart, :heure_depart,
                    :id_agence_arrivee, :date_arrivee, :heure_arrivee, :place
                )
            ");
            $stmt->execute([
                'id_user' => $id_user,
                'id_agence_depart' => $id_agence_depart,
                'date_depart' => $date_depart,
                'heure_depart' => $heure_depart,
                'id_agence_arrivee' => $id_agence_arrivee,
                'date_arrivee' => $date_arrivee,
                'heure_arrivee' => $heure_arrivee,
                'place' => $place
            ]);

            $id_trajet = $this->db->lastInsertId();

            return [
                'status' => 201,
                'success' => true,
                'successMessage' => "Trajet créé avec succès du " .
                                    date('d/m/Y', $departDateTime) . " au " .
                                    date('d/m/Y', $arriveeDateTime),
                'id_trajet' => $id_trajet
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la création du trajet."
            ];
        }
    }

    public function deleteTrajet(string $id_trajet): array {
        $id_trajet = trim($id_trajet);
        if ($id_trajet === '') {
            return [
                'status' => 400,
                'success' => false,
                'errorMessage' => "ID du trajet manquant."
            ];
        }

        try {
            $stmt = $this->db->prepare("DELETE FROM trajets WHERE id_trajet = :id");
            $stmt->execute(['id' => $id_trajet]);

            if ($stmt->rowCount() === 0) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Trajet introuvable ou déjà supprimé."
                ];
            }

            return [
                'status' => 200,
                'success' => true,
                'successMessage' => "Trajet supprimé"
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la suppression."
            ];
        }
    }

    public function updateTrajet(array $data): array {
        $id = trim($data['id_trajet'] ?? '');
        if ($id === '') {
            return [
                'status' => 400,
                'success' => false,
                'errorMessage' => "ID du trajet manquant."
            ];
        }

        try {
            $stmt = $this->db->prepare("SELECT * FROM trajets WHERE id_trajet = :id");
            $stmt->execute(['id' => $id]);
            $trajet = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$trajet) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Trajet introuvable."
                ];
            }

            $updateFields = [];
            $updateValues = [];

            foreach ($data as $key => $value) {
                if ($key !== 'id_trajet' && trim($value) !== '') {
                    $updateFields[] = "$key = :$key";
                    $updateValues[$key] = trim($value);
                }
            }

            if (!empty($updateFields)) {
                $updateValues['id'] = $id;
                $stmt = $this->db->prepare("UPDATE trajets SET " . implode(', ', $updateFields) . " WHERE id_trajet = :id");
                $stmt->execute($updateValues);
            }

            return [
                'status' => 200,
                'success' => true,
                'successMessage' => "Trajet mis à jour"
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la mise à jour."
            ];
        }
    }
}
