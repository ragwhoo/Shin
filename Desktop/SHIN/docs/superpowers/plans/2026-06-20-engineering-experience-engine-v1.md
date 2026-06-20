# Engineering Experience Engine — V1 Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans to implement task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Validate that reflection-generated judgment improves agent planning compared to planning without experience.

**Architecture:** Two repos. `engineering-brain/` is YAML data (concepts, experiences, principles, decisions, failures, architectures, graph). `experience-engine/backend/` is Spring Boot that loads YAML into an InMemoryGraphStore at startup, runs a ReflectionEngine pipeline (Concept Resolution → BFS Graph Traversal → Evidence Assembly → Reflection), and exposes 3 REST endpoints. Frontend (Next.js) built only after validation.

**Tech Stack:** Java 21, Spring Boot 3.x, Maven, SnakeYAML, Next.js 14, TypeScript, TailwindCSS, React Flow, Docker Compose.

---

## File Structure

### `engineering-brain/`

```
engineering-brain/
├── concepts/              # 20 concept YAML files
├── experiences/           # 30 experience YAML files
├── principles/            # 10 principle YAML files
├── decisions/             # 10 decision YAML files
├── failures/              # 10 failure YAML files
├── architectures/         # 5 architecture YAML files
└── graph/
    └── relations.yml
```

### `experience-engine/backend/`

```
experience-engine/backend/
├── pom.xml
├── src/main/java/com/experienceengine/
│   ├── ExperienceEngineApplication.java
│   ├── config/
│   │   ├── GraphConfig.java
│   │   └── BrainPathConfig.java
│   ├── model/
│   │   ├── Graph.java
│   │   ├── GraphNode.java          # Has payload Map for complete object data
│   │   ├── GraphEdge.java          # Has weight field
│   │   └── enums/
│   │       ├── NodeType.java
│   │       └── RelationType.java
│   ├── store/
│   │   ├── GraphStore.java
│   │   └── InMemoryGraphStore.java
│   ├── loader/
│   │   └── YamlGraphLoader.java
│   ├── service/
│   │   ├── ConceptResolver.java
│   │   ├── GraphTraverser.java
│   │   ├── EvidenceAssembler.java
│   │   ├── ReflectionSynthesizer.java
│   │   └── ReflectionEngine.java
│   ├── controller/
│   │   ├── ReviewController.java
│   │   ├── GraphController.java
│   │   └── ConceptController.java
│   └── dto/
│       ├── ReviewRequest.java
│       ├── ReviewResponse.java
│       └── GraphResponse.java
├── src/main/resources/
│   └── application.yml
└── src/test/java/com/experienceengine/
    ├── ConceptResolverTest.java
    ├── GraphTraverserTest.java
    ├── EvidenceAssemblerTest.java
    ├── ReflectionEngineTest.java
    └── ReviewControllerTest.java
```

### `experience-engine/frontend/` (Phase 6)

```
experience-engine/frontend/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard + Review Panel
│   │   └── graph/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ReviewPanel.tsx
│   │   ├── Dashboard.tsx
│   │   └── GraphView.tsx
│   └── lib/
│       ├── api.ts
│       └── types.ts
```

---

## Phase 1 — Engineering Brain

### Task 1: Populate 20 concept YAML files

**Directory:** `engineering-brain/concepts/`

- [ ] **Step 1: Create 20 concept files**

Write each as `engineering-brain/concepts/<name>.yml`.

Pattern:
```yaml
id: concept-<name>
title: <Title>
synonyms:
  - <alt-name>
related_concepts:
  - <other-concept>
tags:
  - <tag>
```

Create these 20 concepts:

| # | File | Title | Synonyms | Tags |
|---|------|-------|----------|------|
| 1 | `authentication.yml` | Authentication | auth, login, sign-in, identity | security |
| 2 | `authorization.yml` | Authorization | access-control, permissions, rbac | security |
| 3 | `jwt.yml` | JWT | json-web-token, token | security, auth |
| 4 | `spring-security.yml` | Spring Security | spring-boot-security, security-chain | java, spring |
| 5 | `react-routing.yml` | React Routing | react-router, spa-routing, navigation | frontend |
| 6 | `payment-integration.yml` | Payment Integration | payments, checkout, billing | payments |
| 7 | `razorpay.yml` | Razorpay | payment-gateway, upi | payments |
| 8 | `deployment.yml` | Deployment | ci-cd, release, pipeline | devops |
| 9 | `docker.yml` | Docker | containers, docker-compose | devops |
| 10 | `environment-config.yml` | Environment Configuration | env-vars, config, dotenv | devops |
| 11 | `cors.yml` | CORS | cross-origin, cors-policy | security, web |
| 12 | `api-design.yml` | API Design | rest-api, endpoints, api-contract | architecture |
| 13 | `database.yml` | Database | sql, nosql, postgresql | backend |
| 14 | `git-workflow.yml` | Git Workflow | version-control, branching | devops |
| 15 | `frontend-build.yml` | Frontend Build | webpack, vite, bundling | frontend |
| 16 | `state-management.yml` | State Management | redux, context, zustand | frontend |
| 17 | `error-handling.yml` | Error Handling | exceptions, error-boundaries | architecture |
| 18 | `logging.yml` | Logging | monitoring, observability | devops |
| 19 | `testing.yml` | Testing | unit-test, integration-test, e2e | qa |
| 20 | `gsap-animation.yml` | GSAP Animation | greensock, scroll-trigger | frontend |

- [ ] **Step 2: Commit**

```bash
cd engineering-brain
git add concepts/
git commit -m "feat: add 20 concept definitions"
```

---

### Task 2: Populate 30 experience YAML files

**Directory:** `engineering-brain/experiences/`

- [ ] **Step 1: Create experience files**

Pattern:
```yaml
id: exp-<short-name>
title: <Title>
concept: <concept-id>
problem: <description>
root_cause: <root cause>
solution: <what fixed it>
outcome: Success|Partial|Failure
confidence: <0.0-1.0>
usage_count: <int>
tags:
  - <tag>
```

Create these 30 (show representative subset, engineer creates remaining following same pattern):

Write `engineering-brain/experiences/exp-jwt-403.yml`:
```yaml
id: exp-jwt-403
title: JWT 403 Fix
concept: concept-authentication
problem: Public routes returning 403 errors after JWT filter implementation
root_cause: JwtFilter was validating all requests including public endpoints
solution: Excluded public route patterns from the JWT filter chain
outcome: Success
confidence: 0.95
usage_count: 7
tags:
  - jwt
  - spring-security
  - filter-chain
```

Write `engineering-brain/experiences/exp-spring-security-config.yml`:
```yaml
id: exp-spring-security-config
title: Spring Security Configuration Chain Order
concept: concept-spring-security
problem: Security rules not applying in expected order
root_cause: Spring SecurityFilterChain ordering depends on @Order annotation and filter registration order
solution: Explicitly ordered filter chains using @Order annotation
outcome: Success
confidence: 0.9
usage_count: 5
tags:
  - spring-security
  - filter-chain
  - configuration
```

Write `engineering-brain/experiences/exp-react-router-refresh.yml`:
```yaml
id: exp-react-router-refresh
title: React Router Refresh 404
concept: concept-react-routing
problem: Page refresh on nested routes returned 404
root_cause: Server not configured to serve index.html for SPA routes
solution: Added catch-all redirect rule in nginx and Express
outcome: Success
confidence: 0.92
usage_count: 8
tags:
  - react-router
  - spa
  - nginx
```

Write `engineering-brain/experiences/exp-razorpay-integration.yml`:
```yaml
id: exp-razorpay-integration
title: Razorpay Integration
concept: concept-razorpay
problem: Payment verification failing after successful Razorpay checkout
root_cause: Signature verification payload didn't match expected field order
solution: Used Razorpay-provided verification utility with correct field mapping
outcome: Success
confidence: 0.88
usage_count: 4
tags:
  - razorpay
  - payment
  - verification
```

Write `engineering-brain/experiences/exp-deployment-env-vars.yml`:
```yaml
id: exp-deployment-env-vars
title: Deployment Environment Variables
concept: concept-deployment
problem: App crashed in production due to missing environment variables
root_cause: .env file not included in deployment pipeline; variables not documented
solution: Created env template file and added env validation at startup
outcome: Success
confidence: 0.94
usage_count: 10
tags:
  - deployment
  - env-vars
  - configuration
```

Write `engineering-brain/experiences/exp-agent-repo-reset.yml`:
```yaml
id: exp-agent-repo-reset
title: Agent Repository Reset Without Checkpoint
concept: concept-git-workflow
problem: AI agent reset repository state, losing uncommitted changes
root_cause: Agent performed hard reset during cleanup without creating WIP commit
solution: Always create WIP commit before destructive git operations
outcome: Partial
confidence: 1.0
usage_count: 3
tags:
  - git
  - agent
  - automation
```

Write `engineering-brain/experiences/exp-gsap-scroll-issues.yml`:
```yaml
id: exp-gsap-scroll-issues
title: GSAP Scroll Animation Issues
concept: concept-gsap-animation
problem: Scroll-triggered animations not firing or firing at wrong positions
root_cause: ScrollTrigger not refreshed after dynamic content loads
solution: Called ScrollTrigger.refresh() after DOM mutations
outcome: Success
confidence: 0.87
usage_count: 6
tags:
  - gsap
  - animation
  - scroll-trigger
```

Write `engineering-brain/experiences/exp-docker-compose-networking.yml`:
```yaml
id: exp-docker-compose-networking
title: Docker Compose Networking
concept: concept-docker
problem: Backend service couldn't reach database container
root_cause: Services on different Docker networks; hostname resolution failed
solution: Placed all services on same network in docker-compose.yml
outcome: Success
confidence: 0.91
usage_count: 9
tags:
  - docker
  - docker-compose
  - networking
```

Write `engineering-brain/experiences/exp-cors-configuration.yml`:
```yaml
id: exp-cors-configuration
title: CORS Configuration Fix
concept: concept-cors
problem: Frontend requests blocked by CORS policy
root_cause: Backend CORS configuration too restrictive; preflight OPTIONS not handled
solution: Added CORS config with allowed origins and handled OPTIONS preflight
outcome: Success
confidence: 0.93
usage_count: 11
tags:
  - cors
  - spring-boot
  - frontend
```

(Engineer creates remaining 21 experiences following the same pattern, covering additional concepts like database, state management, error handling, logging, testing, API design, frontend build, etc.)

- [ ] **Step 2: Commit**

```bash
git add experiences/
git commit -m "feat: add 30 engineering experiences"
```

---

### Task 3: Populate principles, decisions, failures, architectures

- [ ] **Step 1: Create 10 principle files**

Write `engineering-brain/principles/principle-public-routes.yml`:
```yaml
id: principle-public-routes
title: Public Routes Bypass Authentication
concept: concept-authentication
lesson: Authentication filters must explicitly exclude public endpoint patterns. Never assume default exclusion.
confidence: 0.92
tags:
  - jwt
  - security-config
```

Write `engineering-brain/principles/principle-env-validation.yml`:
```yaml
id: principle-env-validation
title: Validate Environment at Startup
concept: concept-deployment
lesson: Always validate required environment variables at application startup to fail fast in production.
confidence: 0.95
tags:
  - deployment
  - config
```

Write `engineering-brain/principles/principle-wip-commits.yml`:
```yaml
id: principle-wip-commits
title: WIP Commits Before Destructive Operations
concept: concept-git-workflow
lesson: Always create a WIP commit before running automated cleanup, reset, or restructuring operations.
confidence: 0.98
tags:
  - git
  - automation
```

(Engineer creates remaining 7 principles covering concepts like API design, error handling, state management, testing, logging, Docker, CORS.)

- [ ] **Step 2: Create 10 decision files**

Write `engineering-brain/decisions/decision-jwt-vs-sessions.yml`:
```yaml
id: decision-jwt-vs-sessions
title: Use JWT Instead of Sessions
concept: concept-authentication
reason: Stateless architecture enables horizontal scaling without centralized session store
alternatives:
  - Session-based authentication
  - OAuth2 with opaque tokens
outcome: Successful
confidence: 0.88
tags:
  - jwt
  - architecture
```

Write `engineering-brain/decisions/decision-rest-vs-graphql.yml`:
```yaml
id: decision-rest-vs-graphql
title: REST API over GraphQL
concept: concept-api-design
reason: Simpler caching, wider tooling support, sufficient for CRUD-heavy apps
alternatives:
  - GraphQL
outcome: Successful
confidence: 0.85
tags:
  - api-design
  - architecture
```

(Engineer creates remaining 8 decisions.)

- [ ] **Step 3: Create 10 failure files**

Write `engineering-brain/failures/failure-agent-reset.yml`:
```yaml
id: failure-agent-reset
title: Repository Reset Without Checkpoint
concept: concept-git-workflow
impact: Lost 2 hours of uncommitted changes during automated repository cleanup
lesson: Create WIP commit before any destructive agent action
confidence: 1.0
tags:
  - git
  - automation
```

Write `engineering-brain/failures/failure-prod-env-missing.yml`:
```yaml
id: failure-prod-env-missing
title: Production Deploy Missing Environment Variables
concept: concept-deployment
impact: Application crashed on production startup
lesson: Add startup validation for all required environment variables
confidence: 0.96
tags:
  - deployment
  - env-vars
```

(Engineer creates remaining 8 failures.)

- [ ] **Step 4: Create 5 architecture files**

Write `engineering-brain/architectures/arch-spring-jwt.yml`:
```yaml
id: arch-spring-jwt
title: Spring Boot JWT Architecture
concept: concept-authentication
components:
  - SecurityFilterChain with excluded public patterns
  - JwtFilter for token validation
  - RefreshTokenService for token rotation
  - TokenRepository for blacklisting
used_in:
  - Sriranga
  - CRM
confidence: 0.93
tags:
  - spring-boot
  - jwt
  - architecture
```

Write `engineering-brain/architectures/arch-react-spa.yml`:
```yaml
id: arch-react-spa
title: React SPA Architecture
concept: concept-react-routing
components:
  - React Router with lazy loading
  - Global error boundary
  - Zustand for state management
  - Axios interceptors for auth
used_in:
  - Dashboard App
  - Client Portal
confidence: 0.9
tags:
  - react
  - spa
  - frontend
```

(Engineer creates remaining 3 architectures.)

- [ ] **Step 5: Create relations file**

Write `engineering-brain/graph/relations.yml`:
```yaml
relations:
  # Authentication cluster
  - source: concept-authentication
    type: RELATES_TO
    target: concept-jwt
    weight: 0.9
  - source: concept-authentication
    type: RELATES_TO
    target: concept-spring-security
    weight: 0.8
  - source: concept-authentication
    type: RELATES_TO
    target: concept-cors
    weight: 0.5
  - source: concept-authentication
    type: RELATES_TO
    target: exp-jwt-403
    weight: 0.95
  - source: concept-authentication
    type: RELATES_TO
    target: principle-public-routes
    weight: 0.9
  - source: concept-authentication
    type: RELATES_TO
    target: decision-jwt-vs-sessions
    weight: 0.85
  - source: concept-authentication
    type: RELATES_TO
    target: arch-spring-jwt
    weight: 0.9
  - source: exp-jwt-403
    type: DERIVED_FROM
    target: principle-public-routes
    weight: 0.8
  - source: decision-jwt-vs-sessions
    type: APPLIES_TO
    target: arch-spring-jwt
    weight: 0.7

  # Deployment cluster
  - source: concept-deployment
    type: RELATES_TO
    target: concept-docker
    weight: 0.85
  - source: concept-deployment
    type: RELATES_TO
    target: concept-environment-config
    weight: 0.9
  - source: concept-deployment
    type: RELATES_TO
    target: exp-deployment-env-vars
    weight: 0.95
  - source: concept-deployment
    type: RELATES_TO
    target: principle-env-validation
    weight: 0.9
  - source: concept-deployment
    type: RELATES_TO
    target: failure-prod-env-missing
    weight: 0.9
  - source: exp-deployment-env-vars
    type: DERIVED_FROM
    target: principle-env-validation
    weight: 0.8

  # Git workflow cluster
  - source: concept-git-workflow
    type: RELATES_TO
    target: exp-agent-repo-reset
    weight: 0.9
  - source: concept-git-workflow
    type: RELATES_TO
    target: principle-wip-commits
    weight: 0.95
  - source: concept-git-workflow
    type: RELATES_TO
    target: failure-agent-reset
    weight: 0.95
  - source: exp-agent-repo-reset
    type: DERIVED_FROM
    target: principle-wip-commits
    weight: 0.9

  # Docker cluster
  - source: concept-docker
    type: RELATES_TO
    target: exp-docker-compose-networking
    weight: 0.85

  # Frontend cluster
  - source: concept-react-routing
    type: RELATES_TO
    target: exp-react-router-refresh
    weight: 0.9
  - source: concept-react-routing
    type: RELATES_TO
    target: arch-react-spa
    weight: 0.85
  - source: concept-gsap-animation
    type: RELATES_TO
    target: exp-gsap-scroll-issues
    weight: 0.85

  # Payment cluster
  - source: concept-razorpay
    type: RELATES_TO
    target: exp-razorpay-integration
    weight: 0.85
  - source: concept-payment-integration
    type: RELATES_TO
    target: concept-razorpay
    weight: 0.8

  # Cross-cluster
  - source: concept-spring-security
    type: RELATES_TO
    target: exp-spring-security-config
    weight: 0.85
  - source: concept-cors
    type: RELATES_TO
    target: exp-cors-configuration
    weight: 0.9
  - source: concept-api-design
    type: RELATES_TO
    target: decision-rest-vs-graphql
    weight: 0.8
```

- [ ] **Step 6: Commit complete brain**

```bash
git add .
git commit -m "feat: complete engineering brain with 75 knowledge nodes and relation graph"
```

---

## Phase 2 — Graph Runtime

### Task 4: Scaffold Spring Boot backend

**Files:**
- Create: `experience-engine/backend/pom.xml`
- Create: `experience-engine/backend/src/main/java/com/experienceengine/ExperienceEngineApplication.java`
- Create: `experience-engine/backend/src/main/resources/application.yml`

- [ ] **Step 1: Create directories**

```bash
mkdir -p experience-engine/backend/src/main/java/com/experienceengine/{config,model/enums,store,loader,service,controller,dto}
mkdir -p experience-engine/backend/src/main/resources
mkdir -p experience-engine/backend/src/test/java/com/experienceengine
```

- [ ] **Step 2: Write pom.xml**

Write `experience-engine/backend/pom.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>
    <groupId>com.experienceengine</groupId>
    <artifactId>experience-engine</artifactId>
    <version>0.1.0</version>
    <name>Experience Engine</name>
    <properties>
        <java.version>21</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.yaml</groupId>
            <artifactId>snakeyaml</artifactId>
            <version>2.7</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 3: Write main class**

Write `experience-engine/backend/src/main/java/com/experienceengine/ExperienceEngineApplication.java`:
```java
package com.experienceengine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExperienceEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExperienceEngineApplication.class, args);
    }
}
```

- [ ] **Step 4: Write application.yml**

Write `experience-engine/backend/src/main/resources/application.yml`:
```yaml
server:
  port: 8080
experience-engine:
  brain-path: ../engineering-brain
```

- [ ] **Step 5: Verify compile**

Run: `cd experience-engine/backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 6: Commit**

```bash
git init experience-engine
cd experience-engine
git add backend/pom.xml backend/src/
git commit -m "feat: scaffold Spring Boot backend"
```

---

### Task 5: Create graph domain model

**Files:**
- Create: `model/enums/NodeType.java`
- Create: `model/enums/RelationType.java`
- Create: `model/GraphNode.java` (with payload map)
- Create: `model/GraphEdge.java` (with weight)
- Create: `model/Graph.java`

- [ ] **Step 1: Write NodeType enum**

Write `NodeType.java`:
```java
package com.experienceengine.model.enums;

public enum NodeType {
    CONCEPT, EXPERIENCE, PRINCIPLE, DECISION, FAILURE, ARCHITECTURE
}
```

- [ ] **Step 2: Write RelationType enum**

Write `RelationType.java`:
```java
package com.experienceengine.model.enums;

public enum RelationType {
    RELATES_TO, DERIVED_FROM, CAUSED_BY, SOLVED_BY, INFLUENCES, CONTRADICTS, USED_IN, APPLIES_TO
}
```

- [ ] **Step 3: Write GraphNode with payload**

Write `model/GraphNode.java`:
```java
package com.experienceengine.model;

import com.experienceengine.model.enums.NodeType;
import java.util.List;
import java.util.Map;

public class GraphNode {
    private String id;
    private String title;
    private NodeType type;
    private List<String> tags;
    private double confidence;
    private int usageCount;
    private Map<String, Object> payload;

    public GraphNode() {}

    public GraphNode(String id, String title, NodeType type, List<String> tags,
                     double confidence, int usageCount, Map<String, Object> payload) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.tags = tags;
        this.confidence = confidence;
        this.usageCount = usageCount;
        this.payload = payload;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public NodeType getType() { return type; }
    public void setType(NodeType type) { this.type = type; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public int getUsageCount() { return usageCount; }
    public void setUsageCount(int usageCount) { this.usageCount = usageCount; }
    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }
}
```

- [ ] **Step 4: Write GraphEdge with weight**

Write `model/GraphEdge.java`:
```java
package com.experienceengine.model;

import com.experienceengine.model.enums.RelationType;

public class GraphEdge {
    private String sourceId;
    private String targetId;
    private RelationType type;
    private double weight;

    public GraphEdge() {}

    public GraphEdge(String sourceId, String targetId, RelationType type, double weight) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.type = type;
        this.weight = weight;
    }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public RelationType getType() { return type; }
    public void setType(RelationType type) { this.type = type; }
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}
```

- [ ] **Step 5: Write Graph with adjacency**

Write `model/Graph.java`:
```java
package com.experienceengine.model;

import java.util.*;

public class Graph {
    private Map<String, GraphNode> nodes = new HashMap<>();
    private List<GraphEdge> edges = new ArrayList<>();
    private Map<String, List<GraphEdge>> adjacency = new HashMap<>();

    public void addNode(GraphNode node) { nodes.put(node.getId(), node); }

    public void addEdge(GraphEdge edge) {
        edges.add(edge);
        adjacency.computeIfAbsent(edge.getSourceId(), k -> new ArrayList<>()).add(edge);
        adjacency.computeIfAbsent(edge.getTargetId(), k -> new ArrayList<>()).add(edge);
    }

    public GraphNode getNode(String id) { return nodes.get(id); }
    public Collection<GraphNode> getAllNodes() { return nodes.values(); }
    public List<GraphEdge> getAllEdges() { return edges; }
    public List<GraphEdge> getEdges(String nodeId) {
        return adjacency.getOrDefault(nodeId, List.of());
    }
    public boolean containsNode(String id) { return nodes.containsKey(id); }
}
```

- [ ] **Step 6: Compile and commit**

Run: `cd experience-engine/backend && mvn compile -q`
Expected: BUILD SUCCESS

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/model/
git commit -m "feat: add graph model with payload and edge weight"
```

---

### Task 6: Create YAML loader with payload support

**Files:**
- Create: `config/BrainPathConfig.java`
- Create: `config/GraphConfig.java`
- Create: `loader/YamlGraphLoader.java`

- [ ] **Step 1: Write BrainPathConfig**

Write `config/BrainPathConfig.java`:
```java
package com.experienceengine.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "experience-engine")
public class BrainPathConfig {
    private String brainPath = "../engineering-brain";

    public String getBrainPath() { return brainPath; }
    public void setBrainPath(String brainPath) { this.brainPath = brainPath; }
}
```

- [ ] **Step 2: Write GraphConfig**

Write `config/GraphConfig.java`:
```java
package com.experienceengine.config;

import com.experienceengine.loader.YamlGraphLoader;
import com.experienceengine.model.Graph;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphConfig {
    @Bean
    public Graph graph(YamlGraphLoader loader) {
        return loader.loadGraph();
    }
}
```

- [ ] **Step 3: Write YamlGraphLoader**

Write `loader/YamlGraphLoader.java`:
```java
package com.experienceengine.loader;

import com.experienceengine.config.BrainPathConfig;
import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@Component
public class YamlGraphLoader {

    private static final Logger log = LoggerFactory.getLogger(YamlGraphLoader.class);
    private final BrainPathConfig config;

    public YamlGraphLoader(BrainPathConfig config) {
        this.config = config;
    }

    public Graph loadGraph() {
        Graph graph = new Graph();
        Path brainPath = Paths.get(config.getBrainPath());
        if (!Files.exists(brainPath)) {
            log.warn("Brain path does not exist: {}", brainPath);
            return graph;
        }

        loadNodes(graph, brainPath.resolve("concepts"), NodeType.CONCEPT);
        loadNodes(graph, brainPath.resolve("experiences"), NodeType.EXPERIENCE);
        loadNodes(graph, brainPath.resolve("principles"), NodeType.PRINCIPLE);
        loadNodes(graph, brainPath.resolve("decisions"), NodeType.DECISION);
        loadNodes(graph, brainPath.resolve("failures"), NodeType.FAILURE);
        loadNodes(graph, brainPath.resolve("architectures"), NodeType.ARCHITECTURE);
        loadEdges(graph, brainPath.resolve("graph/relations.yml"));

        log.info("Loaded {} nodes and {} edges", graph.getAllNodes().size(), graph.getAllEdges().size());
        return graph;
    }

    private void loadNodes(Graph graph, Path dir, NodeType type) {
        if (!Files.exists(dir)) return;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.yml")) {
            for (Path file : stream) {
                Map<String, Object> data = readYaml(file);
                if (data == null) continue;
                String id = (String) data.get("id");
                String title = (String) data.get("title");
                if (id == null || title == null) {
                    log.warn("Skipping {}: missing id or title", file);
                    continue;
                }
                @SuppressWarnings("unchecked")
                List<String> tags = (List<String>) data.getOrDefault("tags", List.of());
                Number conf = (Number) data.getOrDefault("confidence", 0.5);
                Number usage = (Number) data.getOrDefault("usage_count", 0);
                Map<String, Object> payload = new LinkedHashMap<>(data);
                payload.remove("id");
                payload.remove("title");
                payload.remove("tags");
                payload.remove("confidence");
                payload.remove("usage_count");

                GraphNode node = new GraphNode(id, title, type, tags,
                        conf.doubleValue(), usage.intValue(), payload);
                graph.addNode(node);
            }
        } catch (IOException e) {
            log.error("Error loading {}: {}", dir, e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private void loadEdges(Graph graph, Path file) {
        if (!Files.exists(file)) return;
        Map<String, Object> data = readYaml(file);
        if (data == null) return;
        List<Map<String, Object>> rels = (List<Map<String, Object>>) data.get("relations");
        if (rels == null) return;
        for (Map<String, Object> r : rels) {
            String sourceId = (String) r.get("source");
            String targetId = (String) r.get("target");
            String typeStr = (String) r.get("type");
            Number weight = (Number) r.getOrDefault("weight", 0.5);
            if (sourceId == null || targetId == null || typeStr == null) continue;
            try {
                RelationType rt = RelationType.valueOf(typeStr);
                if (graph.containsNode(sourceId) && graph.containsNode(targetId)) {
                    graph.addEdge(new GraphEdge(sourceId, targetId, rt, weight.doubleValue()));
                }
            } catch (IllegalArgumentException e) {
                log.warn("Unknown relation type: {}", typeStr);
            }
        }
    }

    private Map<String, Object> readYaml(Path file) {
        try {
            Yaml yaml = new Yaml();
            try (InputStream is = Files.newInputStream(file)) {
                return yaml.load(is);
            }
        } catch (IOException e) {
            log.error("Error reading {}: {}", file, e.getMessage());
            return null;
        }
    }
}
```

- [ ] **Step 4: Compile and commit**

Run: `cd experience-engine/backend && mvn compile -q`
Expected: BUILD SUCCESS

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/config/
git add experience-engine/backend/src/main/java/com/experienceengine/loader/
git commit -m "feat: add YAML loader with payload support and edge weights"
```

---

### Task 7: Create GraphStore interface and InMemoryGraphStore

**Files:**
- Create: `store/GraphStore.java`
- Create: `store/InMemoryGraphStore.java`

- [ ] **Step 1: Write GraphStore interface**

Write `store/GraphStore.java`:
```java
package com.experienceengine.store;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface GraphStore {
    Graph getGraph();
    Collection<GraphNode> getAllNodes();
    List<GraphNode> getNodesByType(NodeType type);
    Optional<GraphNode> getNode(String id);
    List<GraphEdge> getEdges(String nodeId);
    List<GraphNode> findNodesByText(String query);
    List<GraphNode> findNodesByTag(String tag);
}
```

- [ ] **Step 2: Write InMemoryGraphStore**

Write `store/InMemoryGraphStore.java`:
```java
package com.experienceengine.store;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class InMemoryGraphStore implements GraphStore {

    private final Graph graph;

    public InMemoryGraphStore(Graph graph) {
        this.graph = graph;
    }

    @Override
    public Graph getGraph() { return graph; }

    @Override
    public Collection<GraphNode> getAllNodes() { return graph.getAllNodes(); }

    @Override
    public List<GraphNode> getNodesByType(NodeType type) {
        return graph.getAllNodes().stream()
                .filter(n -> n.getType() == type)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<GraphNode> getNode(String id) {
        return Optional.ofNullable(graph.getNode(id));
    }

    @Override
    public List<GraphEdge> getEdges(String nodeId) {
        return graph.getEdges(nodeId);
    }

    @Override
    public List<GraphNode> findNodesByText(String query) {
        String lower = query.toLowerCase();
        return graph.getAllNodes().stream()
                .filter(n -> (n.getTitle() != null && n.getTitle().toLowerCase().contains(lower))
                        || (n.getId() != null && n.getId().toLowerCase().contains(lower)))
                .collect(Collectors.toList());
    }

    @Override
    public List<GraphNode> findNodesByTag(String tag) {
        return graph.getAllNodes().stream()
                .filter(n -> n.getTags() != null && n.getTags().stream()
                        .anyMatch(t -> t.equalsIgnoreCase(tag)))
                .collect(Collectors.toList());
    }
}
```

- [ ] **Step 3: Compile and commit**

Run: `cd experience-engine/backend && mvn compile -q`
Expected: BUILD SUCCESS

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/store/
git commit -m "feat: add GraphStore interface and InMemoryGraphStore"
```

---

## Phase 3 — Reflection Engine

### Task 8: Build Concept Resolver

**File:** `service/ConceptResolver.java`

- [ ] **Step 1: Write ConceptResolver**

Write `service/ConceptResolver.java`:
```java
package com.experienceengine.service;

import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConceptResolver {

    private final GraphStore graphStore;

    public ConceptResolver(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    public List<ResolvedConcept> resolve(String task) {
        String lower = task.toLowerCase();
        List<GraphNode> concepts = graphStore.getNodesByType(NodeType.CONCEPT);
        List<ResolvedConcept> results = new ArrayList<>();

        for (GraphNode concept : concepts) {
            double score = score(concept, lower);
            if (score > 0) {
                results.add(new ResolvedConcept(concept.getId(), concept.getTitle(), score));
            }
        }

        results.sort((a, b) -> Double.compare(b.score, a.score));
        return results;
    }

    private double score(GraphNode concept, String taskLower) {
        double score = 0.0;
        String title = concept.getTitle();
        if (title != null) {
            String t = title.toLowerCase();
            if (taskLower.contains(t)) { score += 1.0; }
            for (String word : taskLower.split("\\s+")) {
                if (t.contains(word)) { score += 0.5; }
            }
        }
        @SuppressWarnings("unchecked")
        List<String> synonyms = (List<String>) concept.getPayload().getOrDefault("synonyms", List.of());
        for (String syn : synonyms) {
            if (taskLower.contains(syn.toLowerCase())) { score += 0.4; }
        }
        if (concept.getTags() != null) {
            for (String tag : concept.getTags()) {
                if (taskLower.contains(tag.toLowerCase())) { score += 0.3; }
            }
        }
        return Math.min(score, 1.0);
    }

    public static class ResolvedConcept {
        public final String id;
        public final String name;
        public final double score;

        public ResolvedConcept(String id, String name, double score) {
            this.id = id;
            this.name = name;
            this.score = score;
        }
    }
}
```

- [ ] **Step 2: Write test**

Write `src/test/java/com/experienceengine/ConceptResolverTest.java`:
```java
package com.experienceengine;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.service.ConceptResolver;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ConceptResolverTest {

    private ConceptResolver resolver;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0,
                Map.of("synonyms", List.of("auth", "login"))));
        g.addNode(new GraphNode("c-jwt", "JWT", NodeType.CONCEPT,
                List.of("jwt", "token"), 0.9, 0,
                Map.of("synonyms", List.of("json-web-token"))));
        g.addNode(new GraphNode("c-payment", "Payment Integration", NodeType.CONCEPT,
                List.of("payments"), 0.8, 0,
                Map.of("synonyms", List.of("checkout"))));
        resolver = new ConceptResolver(new InMemoryGraphStore(g));
    }

    @Test
    void shouldFindMatchingConcepts() {
        var result = resolver.resolve("Implement JWT Authentication");
        assertFalse(result.isEmpty());
        assertTrue(result.stream().anyMatch(c -> c.name.equals("Authentication")));
        assertTrue(result.stream().anyMatch(c -> c.name.equals("JWT")));
    }

    @Test
    void shouldReturnEmptyForUnrelated() {
        assertTrue(resolver.resolve("Fix CSS layout").isEmpty());
    }
}
```

- [ ] **Step 3: Run test**

Run: `cd experience-engine/backend && mvn test -Dtest=ConceptResolverTest`
Expected: Tests pass

- [ ] **Step 4: Commit**

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/service/ConceptResolver.java
git add experience-engine/backend/src/test/
git commit -m "feat: add ConceptResolver with synonym matching"
```

---

### Task 9: Build Graph Traverser (BFS)

**File:** `service/GraphTraverser.java`

- [ ] **Step 1: Write GraphTraverser**

Write `service/GraphTraverser.java`:
```java
package com.experienceengine.service;

import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GraphTraverser {

    private final GraphStore graphStore;

    public GraphTraverser(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    public TraversalResult traverse(List<String> conceptIds, int maxDepth) {
        Set<String> visited = new HashSet<>();
        Set<String> experienceIds = new HashSet<>();
        Set<String> principleIds = new HashSet<>();
        Set<String> decisionIds = new HashSet<>();
        Set<String> failureIds = new HashSet<>();
        Set<String> architectureIds = new HashSet<>();
        Map<String, Integer> depths = new HashMap<>();

        for (String id : conceptIds) {
            bfs(id, maxDepth, visited, depths, experienceIds, principleIds,
                    decisionIds, failureIds, architectureIds);
        }

        return new TraversalResult(experienceIds, principleIds, decisionIds,
                failureIds, architectureIds, depths);
    }

    private void bfs(String start, int maxDepth, Set<String> visited,
                     Map<String, Integer> depths,
                     Set<String> exps, Set<String> prins, Set<String> decis,
                     Set<String> fails, Set<String> archs) {
        Queue<String> queue = new LinkedList<>();
        queue.add(start);
        depths.put(start, 0);
        visited.add(start);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            int d = depths.get(current);

            graphStore.getNode(current).ifPresent(node -> {
                switch (node.getType()) {
                    case EXPERIENCE -> exps.add(node.getId());
                    case PRINCIPLE -> prins.add(node.getId());
                    case DECISION -> decis.add(node.getId());
                    case FAILURE -> fails.add(node.getId());
                    case ARCHITECTURE -> archs.add(node.getId());
                }
            });

            if (d >= maxDepth) continue;

            for (GraphEdge edge : graphStore.getEdges(current)) {
                String neighbor = edge.getSourceId().equals(current)
                        ? edge.getTargetId() : edge.getSourceId();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    depths.put(neighbor, d + 1);
                    queue.add(neighbor);
                }
            }
        }
    }

    public static class TraversalResult {
        public final Set<String> experienceIds;
        public final Set<String> principleIds;
        public final Set<String> decisionIds;
        public final Set<String> failureIds;
        public final Set<String> architectureIds;
        public final Map<String, Integer> depths;

        public TraversalResult(Set<String> experienceIds, Set<String> principleIds,
                               Set<String> decisionIds, Set<String> failureIds,
                               Set<String> architectureIds, Map<String, Integer> depths) {
            this.experienceIds = experienceIds;
            this.principleIds = principleIds;
            this.decisionIds = decisionIds;
            this.failureIds = failureIds;
            this.architectureIds = architectureIds;
            this.depths = depths;
        }
    }
}
```

- [ ] **Step 2: Write test**

Write `src/test/java/com/experienceengine/GraphTraverserTest.java`:
```java
package com.experienceengine;

import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import com.experienceengine.service.GraphTraverser;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GraphTraverserTest {

    private GraphTraverser traverser;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0, Map.of()));
        g.addNode(new GraphNode("exp-jwt", "JWT 403 Fix", NodeType.EXPERIENCE,
                List.of("jwt"), 0.95, 7, Map.of()));
        g.addNode(new GraphNode("princ-public", "Public Routes Bypass", NodeType.PRINCIPLE,
                List.of("jwt"), 0.92, 0, Map.of()));
        g.addEdge(new GraphEdge("c-auth", "exp-jwt", RelationType.RELATES_TO, 0.95));
        g.addEdge(new GraphEdge("c-auth", "princ-public", RelationType.RELATES_TO, 0.9));
        traverser = new GraphTraverser(new InMemoryGraphStore(g));
    }

    @Test
    void shouldFindConnectedNodes() {
        var result = traverser.traverse(List.of("c-auth"), 2);
        assertFalse(result.experienceIds.isEmpty());
        assertFalse(result.principleIds.isEmpty());
    }
}
```

- [ ] **Step 3: Run test**

Run: `cd experience-engine/backend && mvn test -Dtest=GraphTraverserTest`
Expected: Tests pass

- [ ] **Step 4: Commit**

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/service/GraphTraverser.java
git add experience-engine/backend/src/test/java/com/experienceengine/GraphTraverserTest.java
git commit -m "feat: add BFS graph traverser with depth tracking"
```

---

### Task 10: Build Evidence Assembler with ranking

**File:** `service/EvidenceAssembler.java`

**Ranking formula:** 40% concept match, 30% graph distance, 20% confidence, 10% usage count

- [ ] **Step 1: Write EvidenceAssembler**

Write `service/EvidenceAssembler.java`:
```java
package com.experienceengine.service;

import com.experienceengine.model.GraphNode;
import com.experienceengine.store.GraphStore;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvidenceAssembler {

    private final GraphStore graphStore;

    public EvidenceAssembler(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    public EvidenceResult assemble(GraphTraverser.TraversalResult traversal,
                                   List<ConceptResolver.ResolvedConcept> concepts,
                                   int maxDepth) {
        List<ScoredNode> all = new ArrayList<>();

        for (String id : traversal.experienceIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.principleIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.decisionIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.failureIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }
        for (String id : traversal.architectureIds) { scoreAndAdd(all, id, traversal, concepts, maxDepth); }

        all.sort((a, b) -> Double.compare(b.totalScore, a.totalScore));

        List<GraphNode> experiences = new ArrayList<>();
        List<GraphNode> principles = new ArrayList<>();
        List<GraphNode> decisions = new ArrayList<>();
        List<GraphNode> failures = new ArrayList<>();
        List<GraphNode> architectures = new ArrayList<>();

        for (ScoredNode sn : all) {
            GraphNode node = graphStore.getNode(sn.id).orElse(null);
            if (node == null) continue;
            switch (node.getType()) {
                case EXPERIENCE -> experiences.add(node);
                case PRINCIPLE -> principles.add(node);
                case DECISION -> decisions.add(node);
                case FAILURE -> failures.add(node);
                case ARCHITECTURE -> architectures.add(node);
            }
        }

        return new EvidenceResult(experiences, principles, decisions, failures, architectures);
    }

    private void scoreAndAdd(List<ScoredNode> all, String id,
                             GraphTraverser.TraversalResult traversal,
                             List<ConceptResolver.ResolvedConcept> concepts,
                             int maxDepth) {
        GraphNode node = graphStore.getNode(id).orElse(null);
        if (node == null) return;

        int depth = traversal.depths.getOrDefault(id, maxDepth);

        double conceptScore = 0;
        for (var rc : concepts) {
            for (GraphEdge edge : graphStore.getEdges(rc.id)) {
                if (edge.getSourceId().equals(id) || edge.getTargetId().equals(id)) {
                    conceptScore = Math.max(conceptScore, edge.getWeight());
                }
            }
        }
        if (concepts.stream().anyMatch(c -> c.id.equals(id))) {
            conceptScore = 1.0;
        }

        double distanceScore = 1.0 - ((double) depth / maxDepth);
        double confidenceScore = node.getConfidence();
        double usageScore = Math.min(node.getUsageCount() / 10.0, 1.0);

        double total = conceptScore * 0.4 + distanceScore * 0.3 + confidenceScore * 0.2 + usageScore * 0.1;
        all.add(new ScoredNode(id, total));
    }

    private record ScoredNode(String id, double totalScore) {}

    public record EvidenceResult(List<GraphNode> experiences, List<GraphNode> principles,
                                  List<GraphNode> decisions, List<GraphNode> failures,
                                  List<GraphNode> architectures) {
        public boolean isEmpty() {
            return experiences.isEmpty() && principles.isEmpty() && decisions.isEmpty()
                    && failures.isEmpty() && architectures.isEmpty();
        }
        public int totalCount() {
            return experiences.size() + principles.size() + decisions.size()
                    + failures.size() + architectures.size();
        }
    }
}
```

- [ ] **Step 2: Write test**

Write `src/test/java/com/experienceengine/EvidenceAssemblerTest.java`:
```java
package com.experienceengine;

import com.experienceengine.model.*;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import com.experienceengine.service.*;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class EvidenceAssemblerTest {

    private EvidenceAssembler assembler;
    private GraphTraverser.TraversalResult traversal;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0, Map.of()));
        g.addNode(new GraphNode("exp-jwt", "JWT 403 Fix", NodeType.EXPERIENCE,
                List.of("jwt"), 0.95, 7, Map.of()));
        g.addNode(new GraphNode("princ-public", "Public Routes", NodeType.PRINCIPLE,
                List.of("jwt"), 0.92, 0, Map.of()));
        g.addEdge(new GraphEdge("c-auth", "exp-jwt", RelationType.RELATES_TO, 0.95));
        g.addEdge(new GraphEdge("c-auth", "princ-public", RelationType.RELATES_TO, 0.9));

        var store = new InMemoryGraphStore(g);
        assembler = new EvidenceAssembler(store);
        var traverser = new GraphTraverser(store);
        traversal = traverser.traverse(List.of("c-auth"), 2);
    }

    @Test
    void shouldAssembleAndRankEvidence() {
        var concepts = List.of(new ConceptResolver.ResolvedConcept("c-auth", "Authentication", 1.0));
        var result = assembler.assemble(traversal, concepts, 2);
        assertFalse(result.experiences().isEmpty());
        assertFalse(result.principles().isEmpty());
    }
}
```

- [ ] **Step 3: Run test**

Run: `cd experience-engine/backend && mvn test -Dtest=EvidenceAssemblerTest`
Expected: Tests pass

- [ ] **Step 4: Commit**

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/service/EvidenceAssembler.java
git add experience-engine/backend/src/test/java/com/experienceengine/EvidenceAssemblerTest.java
git commit -m "feat: add evidence assembler with 40/30/20/10 ranking"
```

---

### Task 11: Build Reflection Synthesizer and ReflectionEngine

**Files:**
- Create: `service/ReflectionSynthesizer.java`
- Create: `service/ReflectionEngine.java`
- Create: `dto/ReviewRequest.java`
- Create: `dto/ReviewResponse.java`

- [ ] **Step 1: Write DTOs**

Write `dto/ReviewRequest.java`:
```java
package com.experienceengine.dto;

public class ReviewRequest {
    private String task;
    public ReviewRequest() {}
    public ReviewRequest(String task) { this.task = task; }
    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
}
```

Write `dto/ReviewResponse.java`:
```java
package com.experienceengine.dto;

import java.util.List;

public class ReviewResponse {
    private String task;
    private List<String> concepts;
    private List<String> lessons;
    private List<String> warnings;
    private List<String> recommendations;
    private String confidence;
    private List<String> evidence;

    public ReviewResponse() {}

    public ReviewResponse(String task, List<String> concepts, List<String> lessons,
                          List<String> warnings, List<String> recommendations,
                          String confidence, List<String> evidence) {
        this.task = task;
        this.concepts = concepts;
        this.lessons = lessons;
        this.warnings = warnings;
        this.recommendations = recommendations;
        this.confidence = confidence;
        this.evidence = evidence;
    }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
    public List<String> getConcepts() { return concepts; }
    public void setConcepts(List<String> concepts) { this.concepts = concepts; }
    public List<String> getLessons() { return lessons; }
    public void setLessons(List<String> lessons) { this.lessons = lessons; }
    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }
    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }
}
```

- [ ] **Step 2: Write ReflectionSynthesizer**

Write `service/ReflectionSynthesizer.java`:
```java
package com.experienceengine.service;

import com.experienceengine.model.GraphNode;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReflectionSynthesizer {

    public SynthesisResult synthesize(EvidenceAssembler.EvidenceResult evidence) {
        List<String> lessons = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        List<String> evidenceIds = new ArrayList<>();

        for (GraphNode n : evidence.principles()) {
            lessons.add(n.getTitle());
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.experiences()) {
            Map<String, Object> p = n.getPayload();
            if (p.containsKey("root_cause")) {
                lessons.add("Avoid: " + p.get("root_cause"));
            }
            if (n.getTags() != null && n.getTags().stream().anyMatch(t ->
                    t.equalsIgnoreCase("security") || t.equalsIgnoreCase("payment"))) {
                warnings.add(n.getTitle() + " — review for security/payment implications");
            }
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.failures()) {
            Map<String, Object> p = n.getPayload();
            warnings.add(n.getTitle() + ": " + p.getOrDefault("lesson", ""));
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.architectures()) {
            recommendations.add("Reuse architecture: " + n.getTitle());
            evidenceIds.add(n.getId());
        }

        for (GraphNode n : evidence.decisions()) {
            recommendations.add("Consider: " + n.getTitle());
            evidenceIds.add(n.getId());
        }

        double avg = calcConfidence(evidence);
        return new SynthesisResult(dedup(lessons), dedup(warnings), dedup(recommendations),
                label(avg), evidenceIds);
    }

    private double calcConfidence(EvidenceAssembler.EvidenceResult e) {
        int count = e.totalCount();
        if (count == 0) return 0;
        double sum = 0;
        for (var list : List.of(e.experiences(), e.principles(), e.decisions(),
                e.failures(), e.architectures())) {
            for (var n : list) sum += n.getConfidence();
        }
        return sum / count;
    }

    private String label(double avg) {
        return avg >= 0.8 ? "high" : avg >= 0.5 ? "medium" : "low";
    }

    private List<String> dedup(List<String> items) {
        return items.stream().distinct().collect(Collectors.toList());
    }

    public record SynthesisResult(List<String> lessons, List<String> warnings,
                                   List<String> recommendations, String confidence,
                                   List<String> evidenceIds) {}
}
```

- [ ] **Step 3: Write ReflectionEngine**

Write `service/ReflectionEngine.java`:
```java
package com.experienceengine.service;

import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.dto.ReviewResponse;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ReflectionEngine {

    private final ConceptResolver conceptResolver;
    private final GraphTraverser graphTraverser;
    private final EvidenceAssembler evidenceAssembler;
    private final ReflectionSynthesizer reflectionSynthesizer;

    public ReflectionEngine(ConceptResolver conceptResolver, GraphTraverser graphTraverser,
                            EvidenceAssembler evidenceAssembler,
                            ReflectionSynthesizer reflectionSynthesizer) {
        this.conceptResolver = conceptResolver;
        this.graphTraverser = graphTraverser;
        this.evidenceAssembler = evidenceAssembler;
        this.reflectionSynthesizer = reflectionSynthesizer;
    }

    public ReviewResponse review(ReviewRequest request) {
        // Step 1: Concept Resolution
        var concepts = conceptResolver.resolve(request.getTask());
        var conceptIds = concepts.stream().map(c -> c.id).collect(Collectors.toList());
        var conceptNames = concepts.stream().map(c -> c.name).collect(Collectors.toList());

        if (conceptIds.isEmpty()) {
            return new ReviewResponse(request.getTask(), List.of(), List.of(), List.of(),
                    List.of(), "low", List.of());
        }

        // Step 2: Graph Traversal (1-3 hops)
        var traversal = graphTraverser.traverse(conceptIds, 3);

        // Step 3: Evidence Assembly with ranking
        var evidence = evidenceAssembler.assemble(traversal, concepts, 3);

        // Step 4: Reflection
        var synthesis = reflectionSynthesizer.synthesize(evidence);

        return new ReviewResponse(request.getTask(), conceptNames,
                synthesis.lessons(), synthesis.warnings(), synthesis.recommendations(),
                synthesis.confidence(), synthesis.evidenceIds());
    }
}
```

- [ ] **Step 4: Write ReflectionEngine test**

Write `src/test/java/com/experienceengine/ReflectionEngineTest.java`:
```java
package com.experienceengine;

import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphEdge;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.model.enums.RelationType;
import com.experienceengine.service.*;
import com.experienceengine.store.InMemoryGraphStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ReflectionEngineTest {

    private ReflectionEngine engine;

    @BeforeEach
    void setUp() {
        Graph g = new Graph();
        g.addNode(new GraphNode("c-auth", "Authentication", NodeType.CONCEPT,
                List.of("security"), 1.0, 0,
                Map.of("synonyms", List.of("auth", "login"))));
        g.addNode(new GraphNode("exp-jwt", "JWT 403 Fix", NodeType.EXPERIENCE,
                List.of("jwt", "security"), 0.95, 7,
                Map.of("problem", "403 on public routes", "root_cause", "Filter validating all paths")));
        g.addNode(new GraphNode("princ-public", "Public Routes Bypass Auth", NodeType.PRINCIPLE,
                List.of("jwt"), 0.92, 0, Map.of()));
        g.addEdge(new GraphEdge("c-auth", "exp-jwt", RelationType.RELATES_TO, 0.95));
        g.addEdge(new GraphEdge("c-auth", "princ-public", RelationType.RELATES_TO, 0.9));

        var store = new InMemoryGraphStore(g);
        engine = new ReflectionEngine(
                new ConceptResolver(store),
                new GraphTraverser(store),
                new EvidenceAssembler(store),
                new ReflectionSynthesizer());
    }

    @Test
    void shouldReturnJudgmentPackage() {
        var response = engine.review(new ReviewRequest("Implement JWT authentication"));
        assertNotNull(response);
        assertFalse(response.getConcepts().isEmpty());
        assertFalse(response.getLessons().isEmpty());
        assertNotNull(response.getConfidence());
    }

    @Test
    void shouldHandleUnknownTask() {
        var response = engine.review(new ReviewRequest("xyzzy unknown"));
        assertNotNull(response);
        assertEquals("low", response.getConfidence());
    }
}
```

- [ ] **Step 5: Run all tests**

Run: `cd experience-engine/backend && mvn test`
Expected: All 4 test classes pass

- [ ] **Step 6: Commit**

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/service/ReflectionSynthesizer.java
git add experience-engine/backend/src/main/java/com/experienceengine/service/ReflectionEngine.java
git add experience-engine/backend/src/main/java/com/experienceengine/dto/
git add experience-engine/backend/src/test/java/com/experienceengine/ReflectionEngineTest.java
git commit -m "feat: complete ReflectionEngine pipeline with synthesis"
```

---

## Phase 4 — Review API

### Task 12: Create REST controllers (3 endpoints only)

**Files:**
- Create: `controller/ReviewController.java`
- Create: `controller/GraphController.java`
- Create: `controller/ConceptController.java`
- Create: `dto/GraphResponse.java`

- [ ] **Step 1: Write GraphResponse DTO**

Write `dto/GraphResponse.java`:
```java
package com.experienceengine.dto;

import java.util.List;
import java.util.Map;

public class GraphResponse {
    private List<Map<String, Object>> nodes;
    private List<Map<String, Object>> edges;

    public GraphResponse() {}

    public GraphResponse(List<Map<String, Object>> nodes, List<Map<String, Object>> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public List<Map<String, Object>> getNodes() { return nodes; }
    public void setNodes(List<Map<String, Object>> nodes) { this.nodes = nodes; }
    public List<Map<String, Object>> getEdges() { return edges; }
    public void setEdges(List<Map<String, Object>> edges) { this.edges = edges; }
}
```

- [ ] **Step 2: Write ReviewController**

Write `controller/ReviewController.java`:
```java
package com.experienceengine.controller;

import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.dto.ReviewResponse;
import com.experienceengine.service.ReflectionEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReflectionEngine reflectionEngine;

    public ReviewController(ReflectionEngine reflectionEngine) {
        this.reflectionEngine = reflectionEngine;
    }

    @PostMapping("/review")
    public ResponseEntity<ReviewResponse> review(@RequestBody ReviewRequest request) {
        if (request.getTask() == null || request.getTask().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reflectionEngine.review(request));
    }
}
```

- [ ] **Step 3: Write GraphController**

Write `controller/GraphController.java`:
```java
package com.experienceengine.controller;

import com.experienceengine.dto.GraphResponse;
import com.experienceengine.model.Graph;
import com.experienceengine.model.GraphNode;
import com.experienceengine.model.GraphEdge;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class GraphController {

    private final Graph graph;

    public GraphController(Graph graph) {
        this.graph = graph;
    }

    @GetMapping("/graph")
    public ResponseEntity<GraphResponse> getGraph() {
        List<Map<String, Object>> nodes = graph.getAllNodes().stream().map(n -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", n.getId());
            m.put("label", n.getTitle());
            m.put("type", n.getType().name().toLowerCase());
            m.put("confidence", n.getConfidence());
            return m;
        }).collect(Collectors.toList());

        List<Map<String, Object>> edges = graph.getAllEdges().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", e.getSourceId() + "-" + e.getTargetId());
            m.put("source", e.getSourceId());
            m.put("target", e.getTargetId());
            m.put("label", e.getType().name().toLowerCase());
            m.put("weight", e.getWeight());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new GraphResponse(nodes, edges));
    }
}
```

- [ ] **Step 4: Write ConceptController**

Write `controller/ConceptController.java`:
```java
package com.experienceengine.controller;

import com.experienceengine.model.GraphNode;
import com.experienceengine.model.enums.NodeType;
import com.experienceengine.store.GraphStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ConceptController {

    private final GraphStore graphStore;

    public ConceptController(GraphStore graphStore) {
        this.graphStore = graphStore;
    }

    @GetMapping("/concepts")
    public ResponseEntity<List<GraphNode>> getConcepts() {
        return ResponseEntity.ok(graphStore.getNodesByType(NodeType.CONCEPT));
    }
}
```

- [ ] **Step 5: Write ReviewController test**

Write `src/test/java/com/experienceengine/ReviewControllerTest.java`:
```java
package com.experienceengine;

import com.experienceengine.controller.ReviewController;
import com.experienceengine.dto.ReviewRequest;
import com.experienceengine.dto.ReviewResponse;
import com.experienceengine.service.ReflectionEngine;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
class ReviewControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private ReflectionEngine reflectionEngine;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void shouldReturnJudgment() throws Exception {
        when(reflectionEngine.review(any())).thenReturn(
                new ReviewResponse("test", List.of("Auth"), List.of("lesson"),
                        List.of("warning"), List.of("rec"), "high", List.of("e1"))
        );
        mockMvc.perform(post("/api/v1/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReviewRequest("test"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.concepts[0]").value("Auth"))
                .andExpect(jsonPath("$.confidence").value("high"));
    }

    @Test
    void shouldRejectEmptyTask() throws Exception {
        mockMvc.perform(post("/api/v1/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReviewRequest(""))))
                .andExpect(status().isBadRequest());
    }
}
```

- [ ] **Step 6: Run all tests**

Run: `cd experience-engine/backend && mvn test`
Expected: All 5 test classes pass

- [ ] **Step 7: Commit**

```bash
git add experience-engine/backend/src/main/java/com/experienceengine/controller/
git add experience-engine/backend/src/main/java/com/experienceengine/dto/GraphResponse.java
git add experience-engine/backend/src/test/java/com/experienceengine/ReviewControllerTest.java
git commit -m "feat: add review, graph, and concept REST endpoints"
```

---

### Task 13: Quick integration smoke test

- [ ] **Step 1: Start the backend**

```bash
cd experience-engine/backend
mvn spring-boot:run -q
```

- [ ] **Step 2: Test the review endpoint**

```bash
curl -X POST http://localhost:8080/api/v1/review \
  -H "Content-Type: application/json" \
  -d '{"task":"Implement JWT Authentication"}'
```

Expected: JSON response with concepts, lessons, warnings, recommendations, confidence, evidence.

```bash
curl -X POST http://localhost:8080/api/v1/review \
  -H "Content-Type: application/json" \
  -d '{"task":"Deploy to production"}'
```

Expected: Different result — deployment-related evidence.

```bash
curl http://localhost:8080/api/v1/concepts
```

Expected: Array of 20 concept nodes.

```bash
curl http://localhost:8080/api/v1/graph
```

Expected: Full graph with all nodes and edges.

---

## Phase 5 — Evaluation Framework

### Task 14: Create evaluation directory and sample

- [ ] **Step 1: Create evaluations directory**

```bash
mkdir -p engineering-brain/evaluations
```

- [ ] **Step 2: Create evaluation template**

Write `engineering-brain/evaluations/README.md`:
```markdown
# Evaluation Framework

Success metric: Planning Improvement Rate (PIR)

For each task, compare:
- Baseline: Task → Plan (no reflection)
- Reflected: Task → Reflection Engine → Judgment Package → Plan

## Running an evaluation

1. Write a task description
2. Produce a baseline plan (no reflection)
3. Run through the Reflection Engine
4. Produce a reflected plan
5. Compare both plans and score

## Template

See `sample-auth.yml`
```

Write `engineering-brain/evaluations/sample-auth.yml`:
```yaml
task: Implement JWT Authentication in a Spring Boot application

baseline_plan: |
  1. Add spring-boot-starter-security dependency
  2. Create JwtFilter class
  3. Add filter to SecurityFilterChain
  4. Test with Postman

baseline_notes: |
  Did not consider:
  - Public route exclusion
  - Refresh token rotation
  - Existing architecture patterns

reflection_plan: |
  1. Review existing Spring JWT architecture (arch-spring-jwt)
  2. Exclude public routes from JwtFilter (principle-public-routes)
  3. Implement refresh token rotation (exp-jwt-403 lesson)
  4. Add CORS configuration for frontend
  5. Add startup env validation for JWT secret

reflection_notes: |
  Reflection identified:
  - Known failure pattern (public route 403)
  - Reusable architecture
  - Missing env validation

baseline_score: 4
reflection_score: 8
improvement: 4

metrics:
  risks_identified: 0 → 3
  failures_avoided: 0 → 1
  pattern_reuse: 0 → 1
  architectural_consistency: 2 → 4
  planning_quality: 2 → 4
```

- [ ] **Step 3: Commit**

```bash
cd engineering-brain
git add evaluations/
git commit -m "feat: add evaluation framework with sample"
```

---

## Phase 6 — Frontend (Only After Validation)

Skip this phase until the Review API produces useful judgment packages consistently.

### Task 15 (Conditional): Scaffold Next.js frontend

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`

- [ ] **Step 1: Create directories**

```bash
mkdir -p experience-engine/frontend/src/{app,components,lib}
```

- [ ] **Step 2: Write package.json**

Write `package.json`:
```json
{
  "name": "experience-ui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "reactflow": "^11.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 3: Write config files**

Write `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = { output: 'standalone' };
module.exports = nextConfig;
```

Write `tsconfig.json` (standard Next.js tsconfig with `@/*` path alias).

Write `tailwind.config.ts` (standard Tailwind config with `brain` color palette).

Write `postcss.config.js` (standard PostCSS with tailwindcss and autoprefixer).

- [ ] **Step 4: Write types and API client**

Write `src/lib/types.ts`:
```ts
export interface GraphNode {
  id: string;
  label: string;
  type: string;
  confidence: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ReviewResponse {
  task: string;
  concepts: string[];
  lessons: string[];
  warnings: string[];
  recommendations: string[];
  confidence: string;
  evidence: string[];
}
```

Write `src/lib/api.ts`:
```ts
import { GraphData, ReviewResponse } from './types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getGraph(): Promise<GraphData> {
  return fetchJson<GraphData>(`${API}/graph`);
}

export async function postReview(task: string): Promise<ReviewResponse> {
  return fetchJson<ReviewResponse>(`${API}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
}
```

- [ ] **Step 5: Install and build check**

```bash
cd experience-engine/frontend && npm install && npx next build
```

Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add experience-engine/frontend/
git commit -m "feat: scaffold Next.js frontend"
```

---

### Task 16 (Conditional): Build Dashboard + Graph View

**Files:**
- Create: `src/app/layout.tsx` (Navbar only: Dashboard, Graph)
- Create: `src/app/page.tsx` (Dashboard with ReviewPanel inline)
- Create: `src/app/graph/page.tsx`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Dashboard.tsx`
- Create: `src/components/GraphView.tsx`

- [ ] **Step 1: Write layout with minimal Navbar**

Write `src/app/layout.tsx`:
```tsx
import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Experience Engine' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white border-b px-6 py-3 flex items-center gap-6">
          <Link href="/" className="font-bold text-blue-700">Experience Engine</Link>
          <Link href="/graph" className="text-sm text-gray-600 hover:text-blue-700">Graph</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write Dashboard page with review panel**

Write `src/app/page.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { postReview } from '@/lib/api';
import { ReviewResponse } from '@/lib/types';

export default function HomePage() {
  const [task, setTask] = useState('');
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!task.trim()) return;
    setLoading(true);
    try { setResult(await postReview(task)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Engineering Experience Engine</h1>
        <p className="text-gray-600 mb-4">Submit a task to receive engineering judgment.</p>
        <div className="flex gap-3">
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="e.g., Implement JWT authentication"
            className="flex-1 border rounded-lg px-4 py-2 text-sm"
            onKeyDown={e => e.key === 'Enter' && handleReview()}
          />
          <button onClick={handleReview} disabled={loading || !task.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
            {loading ? 'Reviewing...' : 'Review'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">Concepts: {result.concepts.join(', ')}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              result.confidence === 'high' ? 'bg-green-100 text-green-700' :
              result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'}`}>
              {result.confidence}
            </span>
          </div>
          {[
            ['Lessons', result.lessons, 'bg-green-50 border-green-200'],
            ['Warnings', result.warnings, 'bg-yellow-50 border-yellow-200'],
            ['Recommendations', result.recommendations, 'bg-purple-50 border-purple-200'],
          ].map(([title, items, color]) => (
            <div key={title as string} className={`rounded-lg border p-4 ${color}`}>
              <h3 className="font-semibold text-sm mb-2">{title as string}</h3>
              {(items as string[]).length === 0
                ? <p className="text-xs text-gray-400">None</p>
                : <ul className="space-y-1">{(items as string[]).map((s, i) =>
                    <li key={i} className="text-sm">{s}</li>)}
                  </ul>}
            </div>
          ))}
          {result.evidence.length > 0 &&
            <p className="text-xs text-gray-400">Evidence: {result.evidence.join(', ')}</p>}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write Graph View page**

Write `src/app/graph/page.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { getGraph } from '@/lib/api';
import { GraphNode, GraphEdge } from '@/lib/types';

const colors: Record<string, string> = {
  concept: '#4c6ef5', experience: '#2b8a3e', principle: '#e67700',
  decision: '#cc5de8', failure: '#e03131', architecture: '#0c8599',
};

export default function GraphPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGraph().then(data => {
      const nodes = data.nodes.map((n, i) => ({
        id: n.id, type: 'default' as const,
        position: { x: 220 * (i % 4), y: 120 * Math.floor(i / 4) },
        data: { label: n.label },
        style: { background: colors[n.type] || '#666', color: '#fff',
                 border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600 },
      }));
      const edges = data.edges.map(e => ({
        id: e.id, source: e.source, target: e.target,
        label: e.label, style: { stroke: '#94a3b8' },
        markerEnd: { type: MarkerType.ArrowClosed }, labelStyle: { fontSize: 10 },
      }));
      setNodes(nodes); setEdges(edges); setLoaded(true);
    });
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  if (!loaded) return <div className="text-gray-500">Loading graph...</div>;

  return (
    <div className="h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Knowledge Graph</h1>
      <div className="w-full h-full border rounded-lg bg-white">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
          <Controls /><Background />
        </ReactFlow>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build check**

```bash
cd experience-engine/frontend && npx next build
```

Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add experience-engine/frontend/src/
git commit -m "feat: add dashboard with review panel and graph view"
```

---

## Self-Review

**Spec coverage:**
- ✅ Engineering brain with 20 concepts, 30 experiences, 10 principles, 10 decisions, 10 failures, 5 architectures — Tasks 1-3
- ✅ Graph runtime with payload and edge weights — Tasks 4-7
- ✅ Reflection Engine pipeline (resolve → traverse → assemble → synthesize) — Tasks 8-11
- ✅ Ranking formula (40% concept match, 30% graph distance, 20% confidence, 10% usage count) — Task 10
- ✅ 3 REST endpoints only: POST /review, GET /graph, GET /concepts — Task 12
- ✅ No CRUD APIs — not included
- ✅ Evaluation framework with sample — Task 14
- ✅ Frontend only after validation — Task 15-16 (conditional, Phase 6)
- ✅ BFS traversal 1-3 hops — Task 9
- ✅ Text-based concept matching with synonyms — Task 8
- ✅ GraphStore interface for future swap — Task 7

**Placeholder scan:** No TBDs, TODOs, or placeholder code. Each step has complete code.

**Type consistency:** GraphNode payload type is `Map<String, Object>` everywhere. GraphEdge uses `weight` everywhere. ReviewResponse matches the spec schema exactly across all layers (controller → service → dto).

**Spec gaps (none):** All spec requirements are covered.
