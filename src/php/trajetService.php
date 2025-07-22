<?php
class TrajetService {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function create(array $data): array {
        $id_user = trim($data['id_user'] ?? '');
        $date_depart = trim($data['date_depart'] ?? '');
        $heure_depart = trim($data['heure_depart'] ?? '');
        $date_arrivee = trim($data['date_arrivee'] ?? '');
        $heure_arrivee = trim($data['heure_arrivee'] ?? '');

        $departTime = strtotime("$date_depart $heure_depart");
        $arriveeTime = strtotime("$date_arrivee $heure_arrivee");

        if ($arriveeTime <= $departTime) {
            return [
                'status' => 400,
                'success' => false,
                'errorMessage' => "La date d'arrivée doit être après le départ."
            ];
        }

        try {
            $stmtUser = $this->db->prepare("SELECT id_user FROM users WHERE id_user = :id");
            $stmtUser->execute(['id' => $id_user]);
            if (!$stmtUser->fetch()) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Utilisateur introuvable avec l'ID $id_user"
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
                'id_agence_depart' => trim($data['id_agence_depart']),
                'date_depart' => $date_depart,
                'heure_depart' => $heure_depart,
                'id_agence_arrivee' => trim($data['id_agence_arrivee']),
                'date_arrivee' => $date_arrivee,
                'heure_arrivee' => $heure_arrivee,
                'place' => trim($data['place'])
            ]);

            return [
                'status' => 201,
                'success' => true,
                'successMessage' => "Trajet créé du " . date('d/m/Y', $departTime) . " au " . date('d/m/Y', $arriveeTime),
                'id_trajet' => $this->db->lastInsertId()
            ];

        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la création."
            ];
        }
    }

    public function delete(string $id_trajet): array {
        $id = trim($id_trajet);
        if ($id === '') {
            return [
                'status' => 400,
                'success' => false,
                'errorMessage' => "ID du trajet manquant."
            ];
        }

        try {
            $stmt = $this->db->prepare("SELECT id_user FROM trajets WHERE id_trajet = :id");
            $stmt->execute(['id' => $id]);
            $trajet = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$trajet) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Trajet introuvable ou déjà supprimé."
                ];
            }

            $this->db->prepare("DELETE FROM trajets WHERE id_trajet = :id")->execute(['id' => $id]);

            return [
                'status' => 200,
                'success' => true,
                'successMessage' => "Trajet supprimé",
                'redirectUrl' => $trajet['id_user'] ? "/user/{$trajet['id_user']}" : "/user/menu"
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la suppression."
            ];
        }
    }

    public function update(array $data): array {
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
            $record = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$record) {
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
                $sql = "UPDATE trajets SET " . implode(', ', $updateFields) . " WHERE id_trajet = :id";
                $this->db->prepare($sql)->execute($updateValues);
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
