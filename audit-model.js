/* Local demonstration model. No Azure APIs, credentials, or cloud mutations. */
var VX = (() => {
  'use strict';
  const KEY = 'vexorion-command-v2';
  const XP = Object.freeze({critical:200, high:100, medium:50, low:25});
  const domains = [
    ['identity','Identity & access','users',38,'Entra ID, MFA, Conditional Access, managed identities and access reviews.'],
    ['privilege','Privileged access','key',24,'RBAC, privileged roles, PIM, service principals and least privilege.'],
    ['network','Network security','network',42,'NSGs, private endpoints, firewalls, DDoS, DNS, peering and public exposure.'],
    ['defender','Threat protection','shield',28,'Defender for Cloud coverage, recommendations, vulnerability assessment and alerts.'],
    ['data','Data protection','lock',32,'Data classification, encryption at rest and in transit, retention and access.'],
    ['storage','Storage accounts','database',28,'Blob access, SAS tokens, secure transfer, redundancy and lifecycle management.'],
    ['compute','Compute & virtual machines','server',34,'VM configuration, patching, disk encryption, availability and image hygiene.'],
    ['containers','Containers & AKS','box',30,'Cluster configuration, workload identity, image policies, RBAC and network policies.'],
    ['applications','Applications & APIs','code',28,'App Service, Functions, API Management, TLS and authentication settings.'],
    ['databases','Databases','database',28,'Azure SQL, PostgreSQL and Cosmos DB access, auditing, encryption and recovery.'],
    ['secrets','Keys & secrets','key',22,'Key Vault access, secret expiry, certificate rotation and purge protection.'],
    ['monitoring','Logging & monitoring','activity',32,'Diagnostic settings, Log Analytics, retention, alerts and incident readiness.'],
    ['backup','Backup & recovery','refresh',24,'Backup coverage, vault security, restore tests, recovery objectives and resilience.'],
    ['governance','Governance & policy','layers',30,'Management groups, policy assignments, tags, locks and landing zones.'],
    ['cost','Cost optimization','wallet',26,'Idle resources, rightsizing, reservations, budgets and cost allocation.'],
    ['performance','Performance & reliability','chart',24,'Autoscaling, quotas, availability zones, load balancing and service health.'],
    ['devops','DevOps & supply chain','code',22,'Deployment identities, pipeline permissions, IaC, artifact scanning and secrets.'],
    ['compliance','Compliance & posture','file',26,'Evidence mapping to CIS Azure, Microsoft cloud security benchmark and ISO 27001.']
  ].map(([id,name,icon,checks,description])=>({id,name,icon,checks,description}));
  const members = [
    {id:'alex',name:'Alex Morgan',role:'Cloud Security Engineer',initials:'AM',color:'mint'},
    {id:'sarah',name:'Sarah Chen',role:'Azure Platform Engineer',initials:'SC',color:'purple'},
    {id:'james',name:'James Wilson',role:'Cloud Operations Engineer',initials:'JW',color:'blue'},
    {id:'emma',name:'Emma Davis',role:'Security Analyst',initials:'ED',color:'peach'}
  ];
  // Each entry is one illustrative control failure, not a claim of complete Azure coverage.
  const rules = [
    ['MFA not enforced for privileged accounts','identity','critical','entra-prod-tenant','alex','Enable a Conditional Access policy requiring phishing-resistant MFA for privileged roles. Validate in report-only mode, protect emergency access accounts, then enforce the policy.','Unprotected privileged accounts increase the risk of a tenant-wide compromise.','MCSB IM-6'],
    ['Storage account allows public blob access','storage','critical','stprodassets01','sarah','Review dependent applications and container access. Disable anonymous blob access and verify authenticated access still works.','Anonymous users may be able to read sensitive blob data.','MCSB DP-2'],
    ['Management ports exposed to the internet','network','critical','nsg-prod-web-01',null,'Review inbound NSG rules for ports 22 and 3389. Restrict source ranges and use Azure Bastion or just-in-time access. Verify administrative connectivity.','Public administrative endpoints increase the attack surface.','MCSB NS-2'],
    ['Production secrets found in deployment variables','devops','critical','pipeline-prod-release','emma','Revoke and rotate affected secrets. Replace plain-text variables with a secured Key Vault integration or federated workload identity. Review access logs.','Exposed credentials can enable unauthorized production access.','MCSB DS-8'],
    ['SQL server permits unrestricted public access','databases','critical','sql-prod-core','james','Review firewall rules, establish private connectivity and test application DNS. Disable public network access only after validating the private path.','An unrestricted database endpoint increases the risk of data exposure.','MCSB NS-2'],
    ['Permanent Owner assignments at subscription scope','privilege','high','sub-production','alex','Review Owner assignments with each resource owner. Replace standing privileges with eligible PIM access and narrower roles and scopes.','Excessive standing privileges increase the impact of a compromised identity.','MCSB PA-2'],
    ['Key Vault purge protection is disabled','secrets','high','kv-prod-platform','sarah','Review vault retention and recovery requirements. Enable purge protection and confirm backup and access controls. Purge protection cannot subsequently be disabled.','Deleted keys could be permanently lost and prevent data recovery.','MCSB DP-8'],
    ['Virtual machines missing recent security patches','compute','high','vm-prod-api-03','james','Review outstanding updates in Azure Update Manager. Test the patches, schedule a maintenance window and verify application health after installation.','Unpatched systems may contain exploitable vulnerabilities.','MCSB PV-3'],
    ['AKS local account authentication enabled','containers','high','aks-prod-services','alex','Validate Entra ID authentication and Azure RBAC for cluster operators. Disable local accounts and review emergency access procedures.','Local cluster credentials bypass centralized identity controls.','MCSB IM-1'],
    ['Defender for Servers coverage is incomplete','defender','high','sub-production','emma','Review eligible servers and existing security coverage. Evaluate and enable the appropriate Defender for Servers plan and verify onboarding.','Some servers are missing the expected threat detection coverage.','MCSB LT-1'],
    ['Diagnostic logs are not sent to a workspace','monitoring','high','app-prod-gateway',null,'Create diagnostic settings for relevant resource logs. Send them to the central Log Analytics workspace, choose retention and verify ingestion.','Missing diagnostic evidence can slow incident investigation.','MCSB LT-4'],
    ['Production VM has no backup protection','backup','high','vm-prod-worker-02','james','Select a Recovery Services vault and backup policy matching the workload recovery objectives. Enable protection and verify the first recovery point.','The workload may not be recoverable after data loss.','MCSB BR-1'],
    ['App Service does not enforce HTTPS','applications','high','app-prod-portal','sarah','Review application redirects and TLS dependencies. Enable HTTPS Only, require a supported minimum TLS version and verify endpoint behavior.','Unencrypted requests can expose sensitive application traffic.','MCSB DP-3'],
    ['Sensitive data has no classification labels','data','high','stprodreports01','emma','Identify and classify sensitive data with the data owner. Apply the appropriate labels and access policies, then verify monitoring and retention.','Unclassified data may lack appropriate handling and access policies.','MCSB DP-1'],
    ['Required ownership tags are missing','governance','medium','rg-prod-shared',null,'Confirm the resource owner. Add Owner, Environment and CostCenter tags and evaluate a policy to enforce them for future deployments.','Missing ownership makes response and cost allocation slower.','MCSB AM-1'],
    ['Underutilized virtual machine detected','cost','medium','vm-prod-batch-04','james','Review CPU, memory and peak workloads for a representative period. Validate a smaller SKU with the application owner and monitor after resizing.','Unused capacity increases recurring cloud spend.','WAF Cost Optimization'],
    ['Autoscale is not configured for the API tier','performance','medium','asp-prod-api','sarah','Measure workload demand and capacity. Define tested autoscale rules, minimum and maximum instances, and operational alerts.','Fixed capacity can affect reliability during demand spikes.','WAF Performance Efficiency'],
    ['Access review evidence is out of date','compliance','medium','entra-prod-tenant','emma','Confirm the required review period with the control owner. Run the access review, record decisions and retain verifiable evidence.','Stale evidence makes control effectiveness harder to demonstrate.','ISO 27001 A.5.18'],
    ['Storage lifecycle policy is not configured','storage','medium','stprodarchive02',null,'Review retention and recovery obligations with the data owner. Configure tested lifecycle rules for appropriate cool, archive or deletion transitions.','Old data remains in a more expensive storage tier.','WAF Cost Optimization'],
    ['Backup restore test has not been recorded','backup','medium','rsv-prod-weu','alex','Restore a representative workload into an isolated environment. Verify integrity, measure recovery time and record the test results.','Backup success alone does not establish recoverability.','MCSB BR-4'],
    ['Budget notification recipients are missing','cost','low','budget-prod-monthly','alex','Assign appropriate budget owners and configure threshold notifications. Validate recipient addresses and test the notification workflow.','Budget overruns may not reach accountable owners.','WAF Cost Optimization'],
    ['Resource deletion lock is missing','governance','low','rg-prod-data',null,'Review deployment dependencies and operational procedures. Apply an appropriate deletion lock to critical production resources.','A critical resource could be deleted unintentionally.','MCSB AM-4'],
    ['Log Analytics retention needs review','monitoring','low','law-prod-central','emma','Compare workspace and table retention against investigation, compliance and cost requirements. Update approved retention policies.','Current retention may not match operational requirements.','MCSB LT-6'],
    ['Unused public IP address detected','network','low','pip-prod-retired','james','Verify the IP address has no dependencies, DNS references or planned use. Remove the unused allocation after owner review.','Unused resources add inventory noise and potential recurring cost.','WAF Cost Optimization']
  ];
  const resourceTypes = ['Virtual machine','Storage account','Virtual network','Key Vault','SQL database','App Service','Network security group','Managed identity','AKS cluster','Log Analytics'];
  const prefixes = ['vm','st','vnet','kv','sql','app','nsg','id','aks','law'];
  const resources = Array.from({length:1248},(_,i)=>({id:i,name:`${prefixes[i%10]}-prod-${['core','platform','data','shared'][Math.floor(i/10)%4]}-${String(i+1).padStart(3,'0')}`,type:resourceTypes[i%10],region:['West Europe','North Europe','Germany West Central'][i%3],group:`rg-prod-${['core','platform','data','shared'][Math.floor(i/10)%4]}`}));
  const affectedTypes={identity:'Microsoft Entra tenant',privilege:'Subscription',network:'Network security group',storage:'Storage account',secrets:'Key Vault',compute:'Virtual machine',containers:'AKS cluster',applications:'App Service',databases:'SQL database',monitoring:'Log Analytics',backup:'Recovery Services vault',devops:'Deployment pipeline',governance:'Resource group',cost:'Cost management',data:'Storage account',compliance:'Microsoft Entra tenant',performance:'App Service plan',defender:'Subscription'};
  [...new Map(rules.map(r=>[r[3],r])).values()].forEach((r,i)=>Object.assign(resources[i],{name:r[3],type:affectedTypes[r[1]]||'Azure resource'}));
  function seed() {
    const findings=rules.map((r,i)=>({id:`VX-${1042+i}`,title:r[0],domain:r[1],severity:r[2],resource:r[3],assignee:r[4],remediation:r[5],description:r[6],control:r[7],status:[0,1,5,6,9,11,15,19].includes(i)?'in_progress':'open',detected:'2026-11-13T07:42:00Z'}));
    const ledger={};
    domains.forEach((d,i)=>{
      const member=members[i%4],id=`VX-${1001+i}`,severity=['high','medium','critical','low'][i%4];
      findings.push({id,title:['Restrict unnecessary access','Enable recommended protections','Validate recovery controls'][i%3]+` · ${d.name}`,domain:d.id,severity,resource:`${prefixes[i%10]}-prod-verified-${i+1}`,assignee:member.id,remediation:'The control was reviewed, remediation was validated and evidence was recorded.',description:'This sample finding has been remediated and verified by its assigned engineer.',control:'MCSB · sample mapping',status:'resolved',detected:'2026-11-10T07:42:00Z'});
      ledger[id]={owner:member.id,xp:XP[severity],at:`2026-11-${String(9+i%4).padStart(2,'0')}T10:30:00Z`};
    });
    return {version:2,findings,members:members.map(m=>({...m})),ledger,activity:[{title:'Sarah secured a production Key Vault',detail:'Key & secret protection · +100 XP',at:'2026-11-13T08:12:00Z',member:'sarah'},{title:'Full environment audit completed',detail:'18 audit areas · 1,248 resources',at:'2026-11-13T07:42:00Z',member:null},{title:'Alex verified an identity control',detail:'Identity & access · +100 XP',at:'2026-11-12T16:20:00Z',member:'alex'}],reports:[],lastAudit:'2026-11-13T07:42:00Z',settings:{organization:'Acme Technologies',weeklyGoal:5,notifications:true},auditNumber:1048};
  }
  function load(storage) {
    try {
      const d=JSON.parse(storage.getItem(KEY));
      if(d?.version===2&&Array.isArray(d.findings)&&d.findings.length===42&&Array.isArray(d.members)&&d.members.some(m=>m.id==='alex')&&d.ledger&&Array.isArray(d.activity)&&Array.isArray(d.reports)&&d.settings)return d;
    } catch {}
    return seed();
  }
  function open(data){return data.findings.filter(f=>f.status!=='resolved');}
  function score(data){return Math.round((domains.reduce((s,d)=>s+d.checks,0)-open(data).length*4.5)/domains.reduce((s,d)=>s+d.checks,0)*100);}
  function memberXP(data,id){return data.findings.filter(f=>f.status==='resolved'&&data.ledger[f.id]?.owner===id).reduce((s,f)=>s+data.ledger[f.id].xp,0);}
  function level(xp){return xp>=2400?{name:'Sentinel',n:5,min:2400,max:4000}:xp>=1200?{name:'Guardian',n:4,min:1200,max:2400}:xp>=500?{name:'Defender',n:3,min:500,max:1200}:xp>=200?{name:'Pathfinder',n:2,min:200,max:500}:{name:'Explorer',n:1,min:0,max:200};}
  function update(data,id,{assignee,status,verified},now=new Date().toISOString()) {
    const f=data.findings.find(x=>x.id===id);
    if(!f)throw new Error('Finding not found.');
    if(!['open','in_progress','resolved'].includes(status))throw new Error('Choose a valid finding status.');
    if(assignee&&!data.members.some(m=>m.id===assignee))throw new Error('Choose a workspace teammate.');
    const newlyResolved=f.status!=='resolved'&&status==='resolved';
    if(newlyResolved&&!assignee)throw new Error('Assign an engineer before resolving this finding.');
    if(newlyResolved&&!verified)throw new Error('Verify the remediation before resolving this finding.');
    let awarded=0;
    if(newlyResolved&&!data.ledger[id]){data.ledger[id]={owner:assignee,xp:XP[f.severity],at:now};awarded=XP[f.severity];}
    // The original credit owner is immutable; reopening suspends their XP.
    f.assignee=assignee||null;f.status=status;
    if(newlyResolved){data.activity.unshift({title:`${data.members.find(m=>m.id===assignee).name} resolved ${id}`,detail:`${f.title} · ${awarded?'+'+awarded+' XP':'original XP restored'}`,at:now,member:assignee});}
    return {awarded,finding:f};
  }
  function snapshot(data,domainIds=domains.map(d=>d.id),now=new Date().toISOString()) {
    const findings=data.findings.filter(f=>domainIds.includes(f.domain)).map(f=>({...f,assigneeName:data.members.find(m=>m.id===f.assignee)?.name||'Unassigned'}));
    return {id:`AUD-${data.auditNumber++}`,at:now,domains:[...domainIds],resources:resources.length,checks:domains.filter(d=>domainIds.includes(d.id)).reduce((s,d)=>s+d.checks,0),score:score(data),findings};
  }
  return {KEY,XP,domains,resources,seed,load,open,score,memberXP,level,update,snapshot};
})();
if(typeof module!=='undefined')module.exports=VX;
