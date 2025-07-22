<?php
require_once __DIR__ . '/baseTestCase.php';
require_once __DIR__ . '/../src/php/userService.php';

class AuthServiceTest extends BaseTestCase {
    public function testInitPasswordTropCourt() {
        $service = new AuthService($this->db, 'secret_key');
        $result = $service->initPassword('john@example.com', 'John', '123');
        $this->assertEquals('initPassword', $result['view']);
        $this->assertEquals(400, $result['status']);
    }

    public function testInitPasswordAvecUtilisateur() {
        $this->db->exec("INSERT INTO users (nom, prenom, mail, role) VALUES ('John', 'Doe', 'john@example.com', 'user')");
        $service = new AuthService($this->db, 'secret_key');
        $result = $service->initPassword('john@example.com', 'John', 'securePassword');
        $this->assertEquals(302, $result['status']);
        $this->assertEquals('/login', $result['redirect']);
    }

    public function testAuthenticateUtilisateurInconnu() {
        $service = new AuthService($this->db, 'secret_key');
        $result = $service->authenticate('unknown@example.com', 'password123');
        $this->assertEquals('login', $result['view']);
        $this->assertEquals(400, $result['status']);
    }
}
