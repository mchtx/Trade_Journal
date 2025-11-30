import {
  VStack,
  HStack,
  Button,
  Heading,
  Card,
  CardBody,
  Input,
  Textarea,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useColorModeValue,
  Box,
  Checkbox,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useRuleStore } from '@context/store'
import type { Rule } from '../../types'
import { v4 as uuidv4 } from 'uuid'

export default function Rules() {
  const { rules, addRule, updateRule, deleteRule } = useRuleStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '' })

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const handleOpen = (rule?: Rule) => {
    if (rule) {
      setEditingRule(rule)
      setFormData({ title: rule.title, description: rule.description })
    } else {
      setEditingRule(null)
      setFormData({ title: '', description: '' })
    }
    onOpen()
  }

  const handleSave = () => {
    if (!formData.title.trim()) return

    if (editingRule) {
      updateRule(editingRule.id, {
        title: formData.title,
        description: formData.description,
      })
    } else {
      const newRule: Rule = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addRule(newRule)
    }

    onClose()
    setFormData({ title: '', description: '' })
  }

  const handleTogglePin = (rule: Rule) => {
    updateRule(rule.id, { isPinned: !rule.isPinned })
  }

  const pinnedRules = rules.filter(r => r.isPinned)
  const unpinnedRules = rules.filter(r => !r.isPinned)

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading>🌟 Trading Kuralları</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          onClick={() => handleOpen()}
        >
          Yeni Kural
        </Button>
      </HStack>

      {/* Sabitlenmiş Kurallar */}
      {pinnedRules.length > 0 && (
        <VStack spacing={3} align="stretch">
          <Heading size="md" color="yellow.500">
            📌 Önemli Kurallar
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
            {pinnedRules.map(rule => (
              <Card
                key={rule.id}
                bg={cardBg}
                borderColor="yellow.500"
                borderWidth="2px"
              >
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <Heading size="sm">{rule.title}</Heading>
                    <Box fontSize="sm" color="gray.400">
                      {rule.description}
                    </Box>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Sabitle"
                        icon={<StarIcon />}
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => handleTogglePin(rule)}
                      />
                      <IconButton
                        aria-label="Düzenle"
                        icon={<AddIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpen(rule)}
                      />
                      <IconButton
                        aria-label="Sil"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => deleteRule(rule.id)}
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </VStack>
      )}

      {/* Diğer Kurallar */}
      {unpinnedRules.length > 0 && (
        <VStack spacing={3} align="stretch">
          <Heading size="md">Diğer Kurallar</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
            {unpinnedRules.map(rule => (
              <Card
                key={rule.id}
                bg={bgColor}
                borderColor={borderColor}
                borderWidth="1px"
              >
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <Heading size="sm">{rule.title}</Heading>
                    <Box fontSize="sm" color="gray.400">
                      {rule.description}
                    </Box>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Sabitle"
                        icon={<StarIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTogglePin(rule)}
                      />
                      <IconButton
                        aria-label="Düzenle"
                        icon={<AddIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpen(rule)}
                      />
                      <IconButton
                        aria-label="Sil"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => deleteRule(rule.id)}
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </VStack>
      )}

      {rules.length === 0 && (
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody textAlign="center">
            <Heading size="md" color="gray.400">
              Henüz kural eklenmedi
            </Heading>
          </CardBody>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingRule ? 'Kuralı Düzenle' : 'Yeni Kural Ekle'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Kural Başlığı</FormLabel>
                <Input
                  placeholder="Kural başlığı..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Kural Açıklaması</FormLabel>
                <Textarea
                  placeholder="Kural açıklaması..."
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  minH="120px"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              İptal
            </Button>
            <Button colorScheme="brand" onClick={handleSave}>
              Kaydet
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
