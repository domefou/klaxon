<?php
class AuthService {
    private PDO $db;
    private string $secretKey;

    public function __construct(PDO $db, string $secretKey) {
        $this->db = $db;
        $this->secretKey = $secretKey;
    }

    public function authenticate(string $mail, string $password): array {
        if (strlen($password) < 8) {
            return [
                'status' => 400,
                'view' => 'login',
                'successMessage' => null,
                'errorMessage' => "Le mot de passe doit contenir au moins 8 caractères"
            ];
        }

        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE mail = :mail");
            $stmt->execute(['mail' => $mail]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return [
                    'status' => 400,
                    'view' => 'login',
                    'successMessage' => null,
                    'errorMessage' => "Adresse email incorrecte."
                ];
            }

            if (empty($user['password'])) {
                return [
                    'status' => 400,
                    'view' => 'login',
                    'successMessage' => null,
                    'errorMessage' => "Ce compte n'a pas encore de mot de passe."
                ];
            }

            if (!password_verify($password, $user['password'])) {
                return [
                    'status' => 400,
                    'view' => 'login',
                    'successMessage' => null,
                    'errorMessage' => "Mot de passe incorrect."
                ];
            }

            $token = base64_encode(json_encode([
                'id_user' => $user['id_user'],
                'nom' => $user['nom'],
                'prenom' => $user['prenom'],
                'mail' => $user['mail'],
                'role' => $user['role']
            ]));

            return [
                'status' => 200,
                'redirect' => $user['role'] === 'admin' ? '/admin/menu' : '/user/menu',
                'token' => $token
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'json' => [
                    'message' => "Erreur du serveur interne",
                    'erreur' => $e->getMessage()
                ]
            ];
        }
    }

    public function initPassword(string $mail, string $nom, string $password): array {
        if (strlen($password) < 8) {
            return [
                'status' => 400,
                'view' => 'initPassword',
                'errorMessage' => "Le mot de passe doit contenir au moins 8 caractères"
            ];
        }

        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE mail = :mail AND nom = :nom");
            $stmt->execute(['mail' => $mail, 'nom' => $nom]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return [
                    'status' => 400,
                    'view' => 'initPassword',
                    'errorMessage' => "Adresse email ou nom incorrect."
                ];
            }

            if (!empty($user['password'])) {
                return [
                    'status' => 400,
                    'view' => 'login',
                    'errorMessage' => "Ce compte a déjà un mot de passe défini."
                ];
            }

            $hashed = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $this->db->prepare("UPDATE users SET password = :pwd WHERE id_user = :id");
            $stmt->execute(['pwd' => $hashed, 'id' => $user['id_user']]);

            return [
                'status' => 302,
                'redirect' => '/login',
                'sessionSuccessMessage' => "Mot de passe mis à jour."
            ];
        } catch (PDOException $e) {
            return [
                'status' => 500,
                'json' => [
                    'message' => "Erreur serveur",
                    'erreur' => $e->getMessage()
                ]
            ];
        }
    }
}
