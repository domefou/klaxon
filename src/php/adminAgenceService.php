<?php

class AgenceService {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function createAgence(string $agence): array {
        $agence = trim($agence);
        if ($agence === '') {
            return [
                'status' => 400,
                'success' => false,
                'errorMessage' => "Le nom d'agence est requis."
            ];
        }

        try {
            $stmt = $this->db->prepare("INSERT INTO agences (agence) VALUES (:agence)");
            $stmt->execute(['agence' => $agence]);
            $id_agence = $this->db->lastInsertId();

            return [
                'status' => 201,
                'success' => true,
                'successMessage' => "Agence ajoutée : {$agence}",
                'id_agence' => $id_agence
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la création."
            ];
        }
    }

    public function updateAgence(int $id_agence, string $agence): array {
        $agence = trim($agence);
        if ($agence === '') {
            return [
                'status' => 400,
                'success' => false,
                'errorMessage' => "Données invalides."
            ];
        }

        try {
            $stmt = $this->db->prepare("SELECT * FROM agences WHERE id_agence = :id");
            $stmt->execute(['id' => $id_agence]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$record) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Agence introuvable."
                ];
            }

            $stmt = $this->db->prepare("UPDATE agences SET agence = :agence WHERE id_agence = :id");
            $stmt->execute(['agence' => $agence, 'id' => $id_agence]);

            return [
                'status' => 200,
                'success' => true,
                'successMessage' => "Agence mise à jour : {$agence}"
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la modification."
            ];
        }
    }

    public function deleteAgence(int $id_agence): array {
        try {
            $stmt = $this->db->prepare("DELETE FROM agences WHERE id_agence = :id");
            $stmt->execute(['id' => $id_agence]);

            if ($stmt->rowCount() === 0) {
                return [
                    'status' => 404,
                    'success' => false,
                    'errorMessage' => "Agence introuvable ou déjà supprimée."
                ];
            }

            return [
                'status' => 200,
                'success' => true,
                'successMessage' => "Agence supprimée"
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'success' => false,
                'errorMessage' => "Erreur serveur lors de la suppression."
            ];
        }
    }
}
